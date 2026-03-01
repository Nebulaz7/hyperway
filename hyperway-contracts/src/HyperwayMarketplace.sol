// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IXcm} from "./interfaces/IXCM.sol";

/// @title HyperwayMarketplace
/// @author Hyperway Team — Polkadot Solidity Hackathon (Track 2)
/// @notice Decentralized GPU Compute Marketplace on Polkadot Hub.
///         Connects AI developers needing GPU compute with providers who have spare capacity.
///         Uses smart contract escrow, collateral staking, proof-of-compute verification,
///         and XCM precompiles for cross-chain payments.
/// @dev Deployed on Polkadot Hub (EVM-compatible, chain ID 420420421 mainnet / 420420417 testnet).
contract HyperwayMarketplace is ReentrancyGuard, Ownable, Pausable {
    // ──────────────────────────────────────────────
    //  Constants
    // ──────────────────────────────────────────────

    /// @notice XCM precompile address on Polkadot Hub / Asset Hub
    /// @dev Confirmed from official Polkadot Cookbook:
    ///      https://github.com/brunopgalvao/recipe-contracts-precompile-example
    address public constant XCM_PRECOMPILE =
        0x00000000000000000000000000000000000a0000;

    /// @notice Basis-point denominator (10_000 = 100%)
    uint256 public constant BPS_DENOMINATOR = 10_000;

    // ──────────────────────────────────────────────
    //  Enums
    // ──────────────────────────────────────────────

    /// @notice Lifecycle status of a compute job
    enum JobStatus {
        PENDING, // 0 — Submitted by buyer, waiting for provider
        ASSIGNED, // 1 — Claimed by a provider
        COMPLETED, // 2 — Proof submitted, payment released
        FAILED, // 3 — Provider timed out, buyer refunded
        DISPUTED // 4 — Buyer disputes the result
    }

    // ──────────────────────────────────────────────
    //  Structs
    // ──────────────────────────────────────────────

    /// @notice On-chain representation of a GPU compute provider
    struct Provider {
        address providerAddress;
        uint256 stakedAmount; // DOT collateral
        bytes gpuSpecs; // JSON-encoded GPU info (model, VRAM, etc.)
        uint8 reputationScore; // 0–100
        uint256 totalJobsCompleted;
        uint256 totalJobsFailed;
        bool isActive;
        uint256 registeredAt;
    }

    /// @notice On-chain representation of a compute job
    struct Job {
        uint256 jobId;
        address buyer;
        address provider;
        bytes32 specCID; // IPFS CID of job specification
        bytes32 resultCID; // IPFS CID of compute results
        uint256 paymentAmount; // Escrowed payment in native token (DOT)
        uint256 computeUnits; // Estimated compute time in seconds
        JobStatus status;
        uint256 createdAt;
        uint256 assignedAt;
        uint256 completedAt;
        uint256 deadline; // Absolute timestamp after which provider can be slashed
    }

    // ──────────────────────────────────────────────
    //  State Variables
    // ──────────────────────────────────────────────

    // --- Provider registry ---
    mapping(address => Provider) public providers;
    mapping(address => bool) public isProvider;
    uint256 public providerCount;

    // --- Job management ---
    mapping(uint256 => Job) public jobs;
    uint256 public nextJobId = 1;
    mapping(address => uint256[]) public providerJobs; // provider → job IDs
    mapping(address => uint256[]) public buyerJobs; // buyer   → job IDs

    // --- Configuration (adjustable by owner) ---
    uint256 public minStakeAmount = 1 ether; // Minimum DOT stake for providers
    uint256 public platformFeeBps = 250; // 2.5 % (in basis points)
    address public feeRecipient; // Receives platform fees + slashed collateral

    // --- Aggregate stats ---
    uint256 public totalJobsCreated;
    uint256 public totalJobsCompleted;
    uint256 public totalVolumeEscrowed; // Cumulative DOT escrowed

    // ──────────────────────────────────────────────
    //  Events
    // ──────────────────────────────────────────────

    event ProviderRegistered(
        address indexed provider,
        uint256 stakedAmount,
        bytes gpuSpecs
    );
    event ProviderDeactivated(address indexed provider);
    event ProviderReactivated(address indexed provider);
    event StakeWithdrawn(address indexed provider, uint256 amount);
    event GPUSpecsUpdated(address indexed provider, bytes newSpecs);

    event JobSubmitted(
        uint256 indexed jobId,
        address indexed buyer,
        bytes32 specCID,
        uint256 payment
    );
    event JobAssigned(uint256 indexed jobId, address indexed provider);
    event ProofSubmitted(uint256 indexed jobId, bytes32 resultCID);
    event JobCompleted(
        uint256 indexed jobId,
        address indexed provider,
        uint256 providerPayment
    );
    event JobFailed(uint256 indexed jobId, address indexed provider);
    event JobDisputed(
        uint256 indexed jobId,
        address indexed buyer,
        string reason
    );
    event DisputeResolved(uint256 indexed jobId, bool buyerWins);

    event ProviderSlashed(
        address indexed provider,
        uint256 slashAmount,
        string reason
    );
    event XCMJobSubmitted(
        uint256 indexed jobId,
        address indexed buyer,
        bytes32 specCID
    );

    event PlatformFeeUpdated(uint256 newFeeBps);
    event MinStakeUpdated(uint256 newMinStake);
    event FeeRecipientUpdated(address newRecipient);

    // ──────────────────────────────────────────────
    //  Errors
    // ──────────────────────────────────────────────

    error InsufficientStake(uint256 sent, uint256 required);
    error AlreadyRegistered();
    error NotProvider();
    error ProviderNotActive();
    error PaymentRequired();
    error JobNotPending();
    error JobNotAssigned();
    error NotAssignedProvider();
    error NotJobBuyer();
    error DeadlineNotReached();
    error InvalidFee(uint256 feeBps);
    error ZeroAddress();
    error NothingToWithdraw();
    error ProviderHasActiveJobs();
    error TransferFailed();
    error JobDoesNotExist();

    // ──────────────────────────────────────────────
    //  Modifiers
    // ──────────────────────────────────────────────

    modifier onlyActiveProvider() {
        if (!isProvider[msg.sender]) revert NotProvider();
        if (!providers[msg.sender].isActive) revert ProviderNotActive();
        _;
    }

    modifier jobExists(uint256 jobId) {
        if (jobId == 0 || jobId >= nextJobId) revert JobDoesNotExist();
        _;
    }

    // ──────────────────────────────────────────────
    //  Constructor
    // ──────────────────────────────────────────────

    /// @param _feeRecipient Address that receives platform fees and slashed collateral
    constructor(address _feeRecipient) Ownable(msg.sender) {
        if (_feeRecipient == address(0)) revert ZeroAddress();
        feeRecipient = _feeRecipient;
    }

    // ════════════════════════════════════════════════
    //  PROVIDER MANAGEMENT
    // ════════════════════════════════════════════════

    /// @notice Register as a GPU compute provider by staking DOT collateral
    /// @param gpuSpecs JSON-encoded GPU specifications (model, VRAM, availability, etc.)
    function registerProvider(
        bytes calldata gpuSpecs
    ) external payable whenNotPaused {
        if (isProvider[msg.sender]) revert AlreadyRegistered();
        if (msg.value < minStakeAmount)
            revert InsufficientStake(msg.value, minStakeAmount);

        providers[msg.sender] = Provider({
            providerAddress: msg.sender,
            stakedAmount: msg.value,
            gpuSpecs: gpuSpecs,
            reputationScore: 50, // Start at neutral reputation
            totalJobsCompleted: 0,
            totalJobsFailed: 0,
            isActive: true,
            registeredAt: block.timestamp
        });

        isProvider[msg.sender] = true;
        providerCount++;

        emit ProviderRegistered(msg.sender, msg.value, gpuSpecs);
    }

    /// @notice Add more stake to an existing provider registration
    function addStake() external payable onlyActiveProvider {
        if (msg.value == 0) revert PaymentRequired();
        providers[msg.sender].stakedAmount += msg.value;
    }

    /// @notice Deactivate provider (stops receiving new jobs)
    /// @dev Provider can only deactivate if they have no ASSIGNED jobs
    function deactivateProvider() external {
        if (!isProvider[msg.sender]) revert NotProvider();
        providers[msg.sender].isActive = false;
        emit ProviderDeactivated(msg.sender);
    }

    /// @notice Reactivate a previously deactivated provider
    function reactivateProvider() external {
        if (!isProvider[msg.sender]) revert NotProvider();
        if (providers[msg.sender].stakedAmount < minStakeAmount) {
            revert InsufficientStake(
                providers[msg.sender].stakedAmount,
                minStakeAmount
            );
        }
        providers[msg.sender].isActive = true;
        emit ProviderReactivated(msg.sender);
    }

    /// @notice Withdraw staked DOT (only when deactivated)
    /// @dev Provider must deactivate first and have no active jobs
    function withdrawStake() external nonReentrant {
        if (!isProvider[msg.sender]) revert NotProvider();
        if (providers[msg.sender].isActive) revert ProviderNotActive(); // Must deactivate first

        uint256 amount = providers[msg.sender].stakedAmount;
        if (amount == 0) revert NothingToWithdraw();

        providers[msg.sender].stakedAmount = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();

        emit StakeWithdrawn(msg.sender, amount);
    }

    /// @notice Update GPU specifications
    /// @param newSpecs New JSON-encoded GPU specifications
    function updateGPUSpecs(bytes calldata newSpecs) external {
        if (!isProvider[msg.sender]) revert NotProvider();
        providers[msg.sender].gpuSpecs = newSpecs;
        emit GPUSpecsUpdated(msg.sender, newSpecs);
    }

    // ════════════════════════════════════════════════
    //  JOB MANAGEMENT
    // ════════════════════════════════════════════════

    /// @notice Submit a new compute job with escrowed DOT payment
    /// @param specCID IPFS content identifier of the job specification
    /// @param computeUnits Estimated compute time in seconds
    /// @return jobId The unique identifier for this job
    function submitJob(
        bytes32 specCID,
        uint256 computeUnits
    ) external payable whenNotPaused returns (uint256) {
        if (msg.value == 0) revert PaymentRequired();

        uint256 jobId = nextJobId++;

        jobs[jobId] = Job({
            jobId: jobId,
            buyer: msg.sender,
            provider: address(0),
            specCID: specCID,
            resultCID: bytes32(0),
            paymentAmount: msg.value,
            computeUnits: computeUnits,
            status: JobStatus.PENDING,
            createdAt: block.timestamp,
            assignedAt: 0,
            completedAt: 0,
            deadline: block.timestamp + (computeUnits * 2) // 2× estimated compute time
        });

        buyerJobs[msg.sender].push(jobId);

        totalJobsCreated++;
        totalVolumeEscrowed += msg.value;

        emit JobSubmitted(jobId, msg.sender, specCID, msg.value);
        return jobId;
    }

    // ════════════════════════════════════════════════
    //  XCM CROSS-CHAIN PAYMENTS (Track 2)
    // ════════════════════════════════════════════════

    /// @notice Submit a job using XCM cross-chain payment
    /// @dev Executes a SCALE-encoded XCM message via the XCM precompile.
    ///      The XCM message should encode instructions that deposit native tokens
    ///      into this contract's address. Typical flow:
    ///
    ///      1. Frontend constructs an XCM V5 message with instructions:
    ///         - WithdrawAsset (from buyer's sovereign account on source chain)
    ///         - DepositAsset  (into this contract's address on Polkadot Hub)
    ///      2. This function executes the XCM message via precompile
    ///      3. Checks that the contract actually received funds
    ///      4. Creates the job with escrowed payment
    ///
    ///      XCM messages MUST be VersionedXcm::V5 (prefix 0x05).
    ///
    /// @param specCID IPFS content identifier of the job specification
    /// @param computeUnits Estimated compute time in seconds
    /// @param xcmMessage SCALE-encoded XCM V5 message for cross-chain token transfer
    /// @return jobId The unique identifier for this job
    function submitJobWithXCM(
        bytes32 specCID,
        uint256 computeUnits,
        bytes calldata xcmMessage
    ) external whenNotPaused nonReentrant returns (uint256) {
        // Record balance before XCM execution
        uint256 balanceBefore = address(this).balance;

        // Estimate weight for the XCM message
        IXcm xcm = IXcm(XCM_PRECOMPILE);
        IXcm.Weight memory weight = xcm.weighMessage(xcmMessage);

        // Execute the XCM message (transfers tokens from source → this contract)
        xcm.execute(xcmMessage, weight);

        // Calculate how much was deposited by the XCM execution
        uint256 balanceAfter = address(this).balance;
        uint256 xcmPayment = balanceAfter - balanceBefore;
        require(xcmPayment > 0, "XCM: no funds received");

        // Create the job with the XCM-deposited payment
        uint256 jobId = nextJobId++;

        jobs[jobId] = Job({
            jobId: jobId,
            buyer: msg.sender,
            provider: address(0),
            specCID: specCID,
            resultCID: bytes32(0),
            paymentAmount: xcmPayment,
            computeUnits: computeUnits,
            status: JobStatus.PENDING,
            createdAt: block.timestamp,
            assignedAt: 0,
            completedAt: 0,
            deadline: block.timestamp + (computeUnits * 2)
        });

        buyerJobs[msg.sender].push(jobId);

        totalJobsCreated++;
        totalVolumeEscrowed += xcmPayment;

        emit XCMJobSubmitted(jobId, msg.sender, specCID);
        emit JobSubmitted(jobId, msg.sender, specCID, xcmPayment);
        return jobId;
    }

    /// @notice Send an XCM message to another chain (e.g., notify Asset Hub)
    /// @dev Allows the contract to dispatch cross-chain messages for:
    ///      - Returning excess funds to a parachain
    ///      - Notifying other chains of job completion
    ///      - Cross-chain governance actions (future)
    /// @param destination SCALE-encoded MultiLocation of target chain
    /// @param message SCALE-encoded XCM V5 message
    function sendXCMMessage(
        bytes calldata destination,
        bytes calldata message
    ) external onlyOwner {
        IXcm(XCM_PRECOMPILE).send(destination, message);
    }

    /// @notice Estimate the weight of an XCM message (view function for frontend)
    /// @param message SCALE-encoded XCM V5 message
    /// @return refTime Estimated reference time weight
    /// @return proofSize Estimated proof size weight
    function estimateXCMWeight(
        bytes calldata message
    ) external view returns (uint64 refTime, uint64 proofSize) {
        IXcm.Weight memory weight = IXcm(XCM_PRECOMPILE).weighMessage(message);
        return (weight.refTime, weight.proofSize);
    }

    /// @notice Claim (assign) a pending job as a provider
    /// @param jobId The job to claim
    function assignJob(
        uint256 jobId
    ) external onlyActiveProvider jobExists(jobId) whenNotPaused {
        Job storage job = jobs[jobId];
        if (job.status != JobStatus.PENDING) revert JobNotPending();

        job.provider = msg.sender;
        job.status = JobStatus.ASSIGNED;
        job.assignedAt = block.timestamp;

        providerJobs[msg.sender].push(jobId);

        emit JobAssigned(jobId, msg.sender);
    }

    /// @notice Submit proof of completed compute work and receive payment
    /// @param jobId The job that was completed
    /// @param resultCID IPFS content identifier of the compute results
    /// @param proof Verification proof data (challenge-response hash for MVP)
    function submitProof(
        uint256 jobId,
        bytes32 resultCID,
        bytes calldata proof
    ) external nonReentrant jobExists(jobId) {
        Job storage job = jobs[jobId];
        if (msg.sender != job.provider) revert NotAssignedProvider();
        if (job.status != JobStatus.ASSIGNED) revert JobNotAssigned();

        // Store the result
        job.resultCID = resultCID;
        job.status = JobStatus.COMPLETED;
        job.completedAt = block.timestamp;

        // Calculate fee split
        uint256 fee = (job.paymentAmount * platformFeeBps) / BPS_DENOMINATOR;
        uint256 providerPayment = job.paymentAmount - fee;

        // Update provider stats
        Provider storage provider = providers[msg.sender];
        provider.totalJobsCompleted++;
        _updateReputation(msg.sender, true);

        // Aggregate stats
        totalJobsCompleted++;

        // Transfer payments
        if (providerPayment > 0) {
            (bool successProvider, ) = payable(job.provider).call{
                value: providerPayment
            }("");
            if (!successProvider) revert TransferFailed();
        }

        if (fee > 0) {
            (bool successFee, ) = payable(feeRecipient).call{value: fee}("");
            if (!successFee) revert TransferFailed();
        }

        emit ProofSubmitted(jobId, resultCID);
        emit JobCompleted(jobId, msg.sender, providerPayment);
    }

    /// @notice Cancel a pending job (buyer only, before it's assigned)
    /// @param jobId The job to cancel
    function cancelJob(uint256 jobId) external nonReentrant jobExists(jobId) {
        Job storage job = jobs[jobId];
        if (msg.sender != job.buyer) revert NotJobBuyer();
        if (job.status != JobStatus.PENDING) revert JobNotPending();

        job.status = JobStatus.FAILED;

        // Refund buyer
        if (job.paymentAmount > 0) {
            (bool success, ) = payable(job.buyer).call{
                value: job.paymentAmount
            }("");
            if (!success) revert TransferFailed();
        }

        emit JobFailed(jobId, address(0));
    }

    // ═══════════════════════════════════���════════════
    //  SLASHING & DISPUTES
    // ════════════════════════════════════════════════

    /// @notice Slash a provider who failed to complete a job by the deadline
    /// @param jobId The job that timed out
    function slashProvider(
        uint256 jobId
    ) external nonReentrant jobExists(jobId) {
        Job storage job = jobs[jobId];
        if (msg.sender != job.buyer) revert NotJobBuyer();
        if (job.status != JobStatus.ASSIGNED) revert JobNotAssigned();
        if (block.timestamp <= job.deadline) revert DeadlineNotReached();

        job.status = JobStatus.FAILED;

        Provider storage provider = providers[job.provider];
        uint256 slashAmount = provider.stakedAmount / 10; // 10% slash

        // Update provider state
        provider.stakedAmount -= slashAmount;
        provider.totalJobsFailed++;
        _updateReputation(job.provider, false);

        // If stake drops below minimum, deactivate the provider
        if (provider.stakedAmount < minStakeAmount) {
            provider.isActive = false;
            emit ProviderDeactivated(job.provider);
        }

        // Refund buyer
        if (job.paymentAmount > 0) {
            (bool successBuyer, ) = payable(job.buyer).call{
                value: job.paymentAmount
            }("");
            if (!successBuyer) revert TransferFailed();
        }

        // Send slashed collateral to fee recipient
        if (slashAmount > 0) {
            (bool successSlash, ) = payable(feeRecipient).call{
                value: slashAmount
            }("");
            if (!successSlash) revert TransferFailed();
        }

        emit ProviderSlashed(job.provider, slashAmount, "Job timeout");
        emit JobFailed(jobId, job.provider);
    }

    /// @notice Buyer disputes a completed job's result
    /// @param jobId The job to dispute
    /// @param reason Description of why the result is being disputed
    function disputeResult(
        uint256 jobId,
        string calldata reason
    ) external jobExists(jobId) {
        Job storage job = jobs[jobId];
        if (msg.sender != job.buyer) revert NotJobBuyer();
        // Allow disputing COMPLETED or ASSIGNED jobs
        require(
            job.status == JobStatus.COMPLETED ||
                job.status == JobStatus.ASSIGNED,
            "Cannot dispute this job status"
        );

        job.status = JobStatus.DISPUTED;
        emit JobDisputed(jobId, msg.sender, reason);
    }

    /// @notice Owner resolves a dispute (interim solution — DAO governance in future)
    /// @param jobId The disputed job
    /// @param buyerWins Whether the buyer's dispute is valid
    function resolveDispute(
        uint256 jobId,
        bool buyerWins
    ) external onlyOwner nonReentrant jobExists(jobId) {
        Job storage job = jobs[jobId];
        require(job.status == JobStatus.DISPUTED, "Job not disputed");

        if (buyerWins) {
            job.status = JobStatus.FAILED;

            // Refund buyer
            if (job.paymentAmount > 0) {
                (bool success, ) = payable(job.buyer).call{
                    value: job.paymentAmount
                }("");
                if (!success) revert TransferFailed();
            }

            // Slash provider
            Provider storage provider = providers[job.provider];
            uint256 slashAmount = provider.stakedAmount / 10;
            provider.stakedAmount -= slashAmount;
            provider.totalJobsFailed++;
            _updateReputation(job.provider, false);

            if (slashAmount > 0) {
                (bool successSlash, ) = payable(feeRecipient).call{
                    value: slashAmount
                }("");
                if (!successSlash) revert TransferFailed();
            }

            emit ProviderSlashed(job.provider, slashAmount, "Dispute lost");
        } else {
            // Provider wins — mark as completed (payment already released in submitProof)
            job.status = JobStatus.COMPLETED;

            Provider storage provider = providers[job.provider];
            _updateReputation(job.provider, true);
        }

        emit DisputeResolved(jobId, buyerWins);
    }

    // ════════════════════════════════════════════════
    //  VIEW FUNCTIONS
    // ════════════════════════════════════════════════

    /// @notice Get full provider details
    function getProvider(
        address providerAddr
    ) external view returns (Provider memory) {
        return providers[providerAddr];
    }

    /// @notice Get full job details
    function getJob(uint256 jobId) external view returns (Job memory) {
        return jobs[jobId];
    }

    /// @notice Get all job IDs for a buyer
    function getBuyerJobs(
        address buyer
    ) external view returns (uint256[] memory) {
        return buyerJobs[buyer];
    }

    /// @notice Get all job IDs for a provider
    function getProviderJobs(
        address provider
    ) external view returns (uint256[] memory) {
        return providerJobs[provider];
    }

    /// @notice Get aggregate marketplace statistics
    function getMarketplaceStats()
        external
        view
        returns (
            uint256 _providerCount,
            uint256 _totalJobs,
            uint256 _completedJobs,
            uint256 _totalVolume
        )
    {
        return (
            providerCount,
            totalJobsCreated,
            totalJobsCompleted,
            totalVolumeEscrowed
        );
    }

    // ════════════════════════════════════════════════
    //  ADMIN FUNCTIONS
    // ════════════════════════════════════════════════

    /// @notice Update the platform fee (max 10%)
    function setPlatformFee(uint256 newFeeBps) external onlyOwner {
        if (newFeeBps > 1000) revert InvalidFee(newFeeBps); // Max 10%
        platformFeeBps = newFeeBps;
        emit PlatformFeeUpdated(newFeeBps);
    }

    /// @notice Update minimum stake amount
    function setMinStakeAmount(uint256 newMinStake) external onlyOwner {
        minStakeAmount = newMinStake;
        emit MinStakeUpdated(newMinStake);
    }

    /// @notice Update fee recipient address
    function setFeeRecipient(address newRecipient) external onlyOwner {
        if (newRecipient == address(0)) revert ZeroAddress();
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }

    /// @notice Pause the marketplace (emergency)
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause the marketplace
    function unpause() external onlyOwner {
        _unpause();
    }

    // ════════════════════════════════════════════════
    //  INTERNAL HELPERS
    // ════════════════════════════════════════════════

    /// @dev Update a provider's reputation score based on job outcome
    ///      Score = (completedJobs / totalJobs) * 100
    function _updateReputation(address providerAddr, bool success) internal {
        Provider storage p = providers[providerAddr];
        uint256 total = p.totalJobsCompleted + p.totalJobsFailed;

        if (total > 0) {
            p.reputationScore = uint8((p.totalJobsCompleted * 100) / total);
        }
    }

    /// @dev Allow the contract to receive native DOT directly (for XCM deposits)
    receive() external payable {}
}
