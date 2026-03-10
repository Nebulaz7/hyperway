// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {HyperwayMarketplace} from "../src/HyperwayMarketplace.sol";
import {IXcm} from "../src/interfaces/IXCM.sol";
import {ERC2771Forwarder} from "@openzeppelin/contracts/metatx/ERC2771Forwarder.sol";

contract HyperwayMarketplaceTest is Test {
    HyperwayMarketplace public marketplace;
    ERC2771Forwarder public forwarder;

    address public owner = makeAddr("owner");
    address public feeRecipient = makeAddr("feeRecipient");
    address public provider1 = makeAddr("provider1");
    address public provider2 = makeAddr("provider2");
    address public buyer1 = makeAddr("buyer1");
    address public buyer2 = makeAddr("buyer2");

    // Private keys for gasless signing (must match the addresses above)
    uint256 public buyer1Key;
    uint256 public provider1Key;

    uint256 public constant STAKE_AMOUNT = 2 ether;
    uint256 public constant JOB_PAYMENT = 0.5 ether;
    uint256 public constant COMPUTE_UNITS = 3600; // 1 hour in seconds

    bytes public constant GPU_SPECS = '{"model":"RTX 4090","vram":"24GB"}';
    bytes32 public constant SPEC_CID = keccak256("QmJobSpec123");
    bytes32 public constant RESULT_CID = keccak256("QmResult456");
    bytes public constant PROOF_DATA = "proof_hash_abc";

    // ──────────────────────────────────────────────
    //  Setup
    // ──────────────────────────────────────────────

    function setUp() public {
        // Create wallets with known keys for gasless signing
        (address _buyer1, uint256 _buyer1Key) = makeAddrAndKey("buyer1");
        (address _provider1, uint256 _provider1Key) = makeAddrAndKey("provider1");
        buyer1Key = _buyer1Key;
        provider1Key = _provider1Key;
        // Sanity: makeAddrAndKey("buyer1") == makeAddr("buyer1")
        assert(_buyer1 == buyer1);
        assert(_provider1 == provider1);

        // Deploy forwarder + marketplace
        forwarder = new ERC2771Forwarder("HyperwayForwarder");

        vm.prank(owner);
        marketplace = new HyperwayMarketplace(feeRecipient, address(forwarder));

        // Fund test accounts
        vm.deal(provider1, 100 ether);
        vm.deal(provider2, 100 ether);
        vm.deal(buyer1, 100 ether);
        vm.deal(buyer2, 100 ether);
    }

    // ──────────────────────────────────────────────
    //  Constructor Tests
    // ──────────────────────────────────────────────

    function test_constructor_setsOwner() public view {
        assertEq(marketplace.owner(), owner);
    }

    function test_constructor_setsFeeRecipient() public view {
        assertEq(marketplace.feeRecipient(), feeRecipient);
    }

    function test_constructor_setsDefaults() public view {
        assertEq(marketplace.minStakeAmount(), 1 ether);
        assertEq(marketplace.platformFeeBps(), 250);
        assertEq(marketplace.nextJobId(), 1);
        assertEq(marketplace.providerCount(), 0);
    }

    function test_constructor_revertsZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert(HyperwayMarketplace.ZeroAddress.selector);
        new HyperwayMarketplace(address(0), address(forwarder));
    }

    // ──────────────────────────────────────────────
    //  Provider Registration Tests
    // ──────────────────────────────────────────────

    function test_registerProvider_success() public {
        vm.prank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);

        assertTrue(marketplace.isProvider(provider1));
        assertEq(marketplace.providerCount(), 1);

        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertEq(p.providerAddress, provider1);
        assertEq(p.stakedAmount, STAKE_AMOUNT);
        assertEq(p.reputationScore, 50);
        assertEq(p.totalJobsCompleted, 0);
        assertEq(p.totalJobsFailed, 0);
        assertTrue(p.isActive);
    }

    function test_registerProvider_emitsEvent() public {
        vm.expectEmit(true, false, false, true);
        emit HyperwayMarketplace.ProviderRegistered(
            provider1,
            STAKE_AMOUNT,
            GPU_SPECS
        );

        vm.prank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);
    }

    function test_registerProvider_revertsInsufficientStake() public {
        vm.prank(provider1);
        vm.expectRevert(
            abi.encodeWithSelector(
                HyperwayMarketplace.InsufficientStake.selector,
                0.5 ether,
                1 ether
            )
        );
        marketplace.registerProvider{value: 0.5 ether}(GPU_SPECS);
    }

    function test_registerProvider_revertsAlreadyRegistered() public {
        vm.prank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);

        vm.prank(provider1);
        vm.expectRevert(HyperwayMarketplace.AlreadyRegistered.selector);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);
    }

    function test_registerProvider_multipleProviders() public {
        vm.prank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);

        vm.prank(provider2);
        marketplace.registerProvider{value: 3 ether}(
            '{"model":"A100","vram":"80GB"}'
        );

        assertEq(marketplace.providerCount(), 2);
    }

    // ──────────────────────────────────────────────
    //  Provider Management Tests
    // ──────────────────────────────────────────────

    function test_addStake() public {
        vm.startPrank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);
        marketplace.addStake{value: 1 ether}();
        vm.stopPrank();

        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertEq(p.stakedAmount, STAKE_AMOUNT + 1 ether);
    }

    function test_deactivateProvider() public {
        vm.startPrank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);
        marketplace.deactivateProvider();
        vm.stopPrank();

        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertFalse(p.isActive);
    }

    function test_reactivateProvider() public {
        vm.startPrank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);
        marketplace.deactivateProvider();
        marketplace.reactivateProvider();
        vm.stopPrank();

        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertTrue(p.isActive);
    }

    function test_withdrawStake() public {
        vm.startPrank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);
        marketplace.deactivateProvider();

        uint256 balanceBefore = provider1.balance;
        marketplace.withdrawStake();
        uint256 balanceAfter = provider1.balance;
        vm.stopPrank();

        assertEq(balanceAfter - balanceBefore, STAKE_AMOUNT);

        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertEq(p.stakedAmount, 0);
    }

    function test_withdrawStake_revertsIfActive() public {
        vm.startPrank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);

        vm.expectRevert(HyperwayMarketplace.ProviderNotActive.selector);
        marketplace.withdrawStake();
        vm.stopPrank();
    }

    function test_updateGPUSpecs() public {
        vm.startPrank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);

        bytes memory newSpecs = '{"model":"RTX 5090","vram":"32GB"}';
        marketplace.updateGPUSpecs(newSpecs);
        vm.stopPrank();

        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertEq(p.gpuSpecs, newSpecs);
    }

    // ──────────────────────────────────────────────
    //  Job Submission Tests
    // ──────────────────────────────────────────────

    function test_submitJob_success() public {
        vm.prank(buyer1);
        uint256 jobId = marketplace.submitJob{value: JOB_PAYMENT}(
            SPEC_CID,
            COMPUTE_UNITS
        );

        assertEq(jobId, 1);
        assertEq(marketplace.nextJobId(), 2);
        assertEq(marketplace.totalJobsCreated(), 1);
        assertEq(marketplace.totalVolumeEscrowed(), JOB_PAYMENT);

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(job.buyer, buyer1);
        assertEq(job.provider, address(0));
        assertEq(job.specCID, SPEC_CID);
        assertEq(job.paymentAmount, JOB_PAYMENT);
        assertEq(job.computeUnits, COMPUTE_UNITS);
        assertEq(
            uint8(job.status),
            uint8(HyperwayMarketplace.JobStatus.PENDING)
        );
    }

    function test_submitJob_emitsEvent() public {
        vm.expectEmit(true, true, false, true);
        emit HyperwayMarketplace.JobSubmitted(1, buyer1, SPEC_CID, JOB_PAYMENT);

        vm.prank(buyer1);
        marketplace.submitJob{value: JOB_PAYMENT}(SPEC_CID, COMPUTE_UNITS);
    }

    function test_submitJob_revertsNoPayment() public {
        vm.prank(buyer1);
        vm.expectRevert(HyperwayMarketplace.PaymentRequired.selector);
        marketplace.submitJob{value: 0}(SPEC_CID, COMPUTE_UNITS);
    }

    function test_submitJob_multipleJobs() public {
        vm.startPrank(buyer1);
        uint256 id1 = marketplace.submitJob{value: JOB_PAYMENT}(
            SPEC_CID,
            COMPUTE_UNITS
        );
        uint256 id2 = marketplace.submitJob{value: 1 ether}(
            keccak256("spec2"),
            7200
        );
        vm.stopPrank();

        assertEq(id1, 1);
        assertEq(id2, 2);
        assertEq(marketplace.totalJobsCreated(), 2);

        uint256[] memory buyerJobIds = marketplace.getBuyerJobs(buyer1);
        assertEq(buyerJobIds.length, 2);
    }

    // ──────────────────────────────────────────────
    //  Job Assignment Tests
    // ──────────────────────────────────────────────

    function test_assignJob_success() public {
        // Setup
        _registerProvider(provider1);
        uint256 jobId = _submitJob(buyer1);

        // Assign
        vm.prank(provider1);
        marketplace.assignJob(jobId);

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(job.provider, provider1);
        assertEq(
            uint8(job.status),
            uint8(HyperwayMarketplace.JobStatus.ASSIGNED)
        );
        assertTrue(job.assignedAt > 0);

        uint256[] memory providerJobIds = marketplace.getProviderJobs(
            provider1
        );
        assertEq(providerJobIds.length, 1);
        assertEq(providerJobIds[0], jobId);
    }

    function test_assignJob_revertsNotProvider() public {
        uint256 jobId = _submitJob(buyer1);

        vm.prank(buyer1); // Not a provider
        vm.expectRevert(HyperwayMarketplace.NotProvider.selector);
        marketplace.assignJob(jobId);
    }

    function test_assignJob_revertsNotPending() public {
        _registerProvider(provider1);
        _registerProvider(provider2);
        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        vm.prank(provider2);
        vm.expectRevert(HyperwayMarketplace.JobNotPending.selector);
        marketplace.assignJob(jobId);
    }

    // ──────────────────────────────────────────────
    //  Proof Submission & Payment Tests
    // ──────────────────────────────────────────────

    function test_submitProof_success() public {
        _registerProvider(provider1);
        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        uint256 providerBalBefore = provider1.balance;
        uint256 feeRecipientBalBefore = feeRecipient.balance;

        vm.prank(provider1);
        marketplace.submitProof(jobId, RESULT_CID, PROOF_DATA);

        // Verify job state
        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(
            uint8(job.status),
            uint8(HyperwayMarketplace.JobStatus.COMPLETED)
        );
        assertEq(job.resultCID, RESULT_CID);
        assertTrue(job.completedAt > 0);

        // Verify payment distribution (2.5% fee)
        uint256 expectedFee = (JOB_PAYMENT * 250) / 10_000;
        uint256 expectedProviderPayment = JOB_PAYMENT - expectedFee;

        assertEq(
            provider1.balance - providerBalBefore,
            expectedProviderPayment
        );
        assertEq(feeRecipient.balance - feeRecipientBalBefore, expectedFee);

        // Verify provider stats
        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertEq(p.totalJobsCompleted, 1);
        assertEq(marketplace.totalJobsCompleted(), 1);
    }

    function test_submitProof_emitsEvents() public {
        _registerProvider(provider1);
        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        uint256 expectedFee = (JOB_PAYMENT * 250) / 10_000;
        uint256 expectedProviderPayment = JOB_PAYMENT - expectedFee;

        vm.expectEmit(true, false, false, true);
        emit HyperwayMarketplace.ProofSubmitted(jobId, RESULT_CID);

        vm.expectEmit(true, true, false, true);
        emit HyperwayMarketplace.JobCompleted(
            jobId,
            provider1,
            expectedProviderPayment
        );

        vm.prank(provider1);
        marketplace.submitProof(jobId, RESULT_CID, PROOF_DATA);
    }

    function test_submitProof_revertsNotAssignedProvider() public {
        _registerProvider(provider1);
        _registerProvider(provider2);
        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        vm.prank(provider2); // Wrong provider
        vm.expectRevert(HyperwayMarketplace.NotAssignedProvider.selector);
        marketplace.submitProof(jobId, RESULT_CID, PROOF_DATA);
    }

    function test_submitProof_revertsNotAssigned() public {
        _registerProvider(provider1);
        uint256 jobId = _submitJob(buyer1);

        // Job is still PENDING, not ASSIGNED
        vm.prank(provider1);
        vm.expectRevert(HyperwayMarketplace.NotAssignedProvider.selector);
        marketplace.submitProof(jobId, RESULT_CID, PROOF_DATA);
    }

    // ──────────────────────────────────────────────
    //  Cancel Job Tests
    // ───────────────────────��──────────────────────

    function test_cancelJob_success() public {
        uint256 jobId = _submitJob(buyer1);
        uint256 balanceBefore = buyer1.balance;

        vm.prank(buyer1);
        marketplace.cancelJob(jobId);

        assertEq(buyer1.balance - balanceBefore, JOB_PAYMENT);

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(
            uint8(job.status),
            uint8(HyperwayMarketplace.JobStatus.FAILED)
        );
    }

    function test_cancelJob_revertsNotBuyer() public {
        uint256 jobId = _submitJob(buyer1);

        vm.prank(buyer2);
        vm.expectRevert(HyperwayMarketplace.NotJobBuyer.selector);
        marketplace.cancelJob(jobId);
    }

    function test_cancelJob_revertsNotPending() public {
        _registerProvider(provider1);
        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        vm.prank(buyer1);
        vm.expectRevert(HyperwayMarketplace.JobNotPending.selector);
        marketplace.cancelJob(jobId);
    }

    // ──────────────────────────────────────────────
    //  Slashing Tests
    // ──────────────────────────────────────────────

    function test_slashProvider_success() public {
        _registerProvider(provider1);
        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        // Warp past deadline (computeUnits * 2 + 1)
        vm.warp(block.timestamp + (COMPUTE_UNITS * 2) + 1);

        uint256 buyerBalBefore = buyer1.balance;
        uint256 feeBalBefore = feeRecipient.balance;

        vm.prank(buyer1);
        marketplace.slashProvider(jobId);

        // Buyer refunded
        assertEq(buyer1.balance - buyerBalBefore, JOB_PAYMENT);

        // Provider slashed 10% of stake
        uint256 expectedSlash = STAKE_AMOUNT / 10;
        assertEq(feeRecipient.balance - feeBalBefore, expectedSlash);

        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertEq(p.stakedAmount, STAKE_AMOUNT - expectedSlash);
        assertEq(p.totalJobsFailed, 1);

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(
            uint8(job.status),
            uint8(HyperwayMarketplace.JobStatus.FAILED)
        );
    }

    function test_slashProvider_revertsBeforeDeadline() public {
        _registerProvider(provider1);
        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        // Don't warp — still before deadline
        vm.prank(buyer1);
        vm.expectRevert(HyperwayMarketplace.DeadlineNotReached.selector);
        marketplace.slashProvider(jobId);
    }

    function test_slashProvider_deactivatesOnLowStake() public {
        // Register with minimum stake
        vm.prank(provider1);
        marketplace.registerProvider{value: 1 ether}(GPU_SPECS);

        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        vm.warp(block.timestamp + (COMPUTE_UNITS * 2) + 1);

        vm.prank(buyer1);
        marketplace.slashProvider(jobId);

        // After 10% slash of 1 ether = 0.1 ether slashed → 0.9 ether remaining
        // 0.9 ether < 1 ether minStake → deactivated
        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertFalse(p.isActive);
    }

    // ──────────────────────────────────────────────
    //  Dispute Tests
    // ──────────────────────────────────────────────

    function test_disputeResult() public {
        _registerProvider(provider1);
        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        vm.prank(provider1);
        marketplace.submitProof(jobId, RESULT_CID, PROOF_DATA);

        vm.prank(buyer1);
        marketplace.disputeResult(jobId, "Model accuracy below threshold");

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(
            uint8(job.status),
            uint8(HyperwayMarketplace.JobStatus.DISPUTED)
        );
    }

    function test_resolveDispute_buyerWins() public {
        _registerProvider(provider1);
        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        // Buyer disputes before proof submission
        vm.prank(buyer1);
        marketplace.disputeResult(jobId, "Provider unresponsive");

        vm.prank(owner);
        marketplace.resolveDispute(jobId, true);

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(
            uint8(job.status),
            uint8(HyperwayMarketplace.JobStatus.FAILED)
        );
    }

    function test_resolveDispute_providerWins() public {
        _registerProvider(provider1);
        uint256 jobId = _submitJob(buyer1);

        vm.prank(provider1);
        marketplace.assignJob(jobId);

        vm.prank(provider1);
        marketplace.submitProof(jobId, RESULT_CID, PROOF_DATA);

        vm.prank(buyer1);
        marketplace.disputeResult(jobId, "False claim");

        vm.prank(owner);
        marketplace.resolveDispute(jobId, false);

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(
            uint8(job.status),
            uint8(HyperwayMarketplace.JobStatus.COMPLETED)
        );
    }

    // ──────────────────────────────────────────────
    //  Admin Tests
    // ─────────────────────��────────────────────────

    function test_setPlatformFee() public {
        vm.prank(owner);
        marketplace.setPlatformFee(500); // 5%

        assertEq(marketplace.platformFeeBps(), 500);
    }

    function test_setPlatformFee_revertsOver10Percent() public {
        vm.prank(owner);
        vm.expectRevert(
            abi.encodeWithSelector(
                HyperwayMarketplace.InvalidFee.selector,
                1001
            )
        );
        marketplace.setPlatformFee(1001);
    }

    function test_setMinStakeAmount() public {
        vm.prank(owner);
        marketplace.setMinStakeAmount(5 ether);

        assertEq(marketplace.minStakeAmount(), 5 ether);
    }

    function test_setFeeRecipient() public {
        address newRecipient = makeAddr("newFeeRecipient");

        vm.prank(owner);
        marketplace.setFeeRecipient(newRecipient);

        assertEq(marketplace.feeRecipient(), newRecipient);
    }

    function test_pause_unpause() public {
        vm.prank(owner);
        marketplace.pause();

        // Registering should revert when paused
        vm.prank(provider1);
        vm.expectRevert();
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);

        vm.prank(owner);
        marketplace.unpause();

        // Should work again
        vm.prank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);
        assertTrue(marketplace.isProvider(provider1));
    }

    // ──────────────────────────────────────────────
    //  View Function Tests
    // ──────────────────────────────────────���───────

    function test_getMarketplaceStats() public {
        _registerProvider(provider1);
        _submitJob(buyer1);
        _submitJob(buyer2);

        (
            uint256 pCount,
            uint256 totalJobs,
            uint256 completedJobs,
            uint256 totalVolume
        ) = marketplace.getMarketplaceStats();

        assertEq(pCount, 1);
        assertEq(totalJobs, 2);
        assertEq(completedJobs, 0);
        assertEq(totalVolume, JOB_PAYMENT * 2);
    }

    // ──────────────────────────────────────────────
    //  Full Lifecycle Integration Test
    // ──────────────────────────────────────────────

    function test_fullLifecycle() public {
        // 1. Provider registers
        vm.prank(provider1);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);

        // 2. Buyer submits job
        vm.prank(buyer1);
        uint256 jobId = marketplace.submitJob{value: JOB_PAYMENT}(
            SPEC_CID,
            COMPUTE_UNITS
        );

        // 3. Provider claims job
        vm.prank(provider1);
        marketplace.assignJob(jobId);

        // 4. Provider submits proof
        uint256 providerBalBefore = provider1.balance;

        vm.prank(provider1);
        marketplace.submitProof(jobId, RESULT_CID, PROOF_DATA);

        // 5. Verify final state
        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(
            uint8(job.status),
            uint8(HyperwayMarketplace.JobStatus.COMPLETED)
        );
        assertEq(job.resultCID, RESULT_CID);

        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertEq(p.totalJobsCompleted, 1);
        assertGt(p.reputationScore, 50); // Should be 100 after 1 success

        // Payment check
        uint256 expectedFee = (JOB_PAYMENT * 250) / 10_000;
        uint256 expectedPayment = JOB_PAYMENT - expectedFee;
        assertEq(provider1.balance - providerBalBefore, expectedPayment);

        // Stats
        assertEq(marketplace.totalJobsCompleted(), 1);
    }

    function test_fullLifecycle_multipleJobs() public {
        // Register two providers
        _registerProvider(provider1);
        _registerProvider(provider2);

        // Submit three jobs
        vm.prank(buyer1);
        uint256 jobId1 = marketplace.submitJob{value: JOB_PAYMENT}(
            SPEC_CID,
            COMPUTE_UNITS
        );

        vm.prank(buyer1);
        uint256 jobId2 = marketplace.submitJob{value: 1 ether}(
            keccak256("spec2"),
            7200
        );

        vm.prank(buyer2);
        uint256 jobId3 = marketplace.submitJob{value: 0.25 ether}(
            keccak256("spec3"),
            1800
        );

        // Provider 1 takes job 1 and 3, provider 2 takes job 2
        vm.prank(provider1);
        marketplace.assignJob(jobId1);

        vm.prank(provider2);
        marketplace.assignJob(jobId2);

        vm.prank(provider1);
        marketplace.assignJob(jobId3);

        // Complete all jobs
        vm.prank(provider1);
        marketplace.submitProof(jobId1, RESULT_CID, PROOF_DATA);

        vm.prank(provider2);
        marketplace.submitProof(jobId2, keccak256("result2"), PROOF_DATA);

        vm.prank(provider1);
        marketplace.submitProof(jobId3, keccak256("result3"), PROOF_DATA);

        // Verify
        assertEq(marketplace.totalJobsCompleted(), 3);

        HyperwayMarketplace.Provider memory p1 = marketplace.getProvider(
            provider1
        );
        assertEq(p1.totalJobsCompleted, 2);
        assertEq(p1.reputationScore, 100);

        HyperwayMarketplace.Provider memory p2 = marketplace.getProvider(
            provider2
        );
        assertEq(p2.totalJobsCompleted, 1);
        assertEq(p2.reputationScore, 100);
    }

    // ──────────────────────────────────────────────
    //  Fuzz Tests
    // ──────────────────────────────────────────────

    function testFuzz_submitJob_anyPayment(uint256 payment) public {
        payment = bound(payment, 1, 1000 ether);
        vm.deal(buyer1, payment);

        vm.prank(buyer1);
        uint256 jobId = marketplace.submitJob{value: payment}(
            SPEC_CID,
            COMPUTE_UNITS
        );

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(job.paymentAmount, payment);
    }

    function testFuzz_registerProvider_anyStake(uint256 stake) public {
        stake = bound(stake, 1 ether, 10_000 ether);
        vm.deal(provider1, stake);

        vm.prank(provider1);
        marketplace.registerProvider{value: stake}(GPU_SPECS);

        HyperwayMarketplace.Provider memory p = marketplace.getProvider(
            provider1
        );
        assertEq(p.stakedAmount, stake);
    }

    // ──────────────────────────────────────────────
    //  XCM Integration Tests (Mocked Precompile)
    // ──────────────────────────────────────────────
    //
    // These tests use vm.etch + vm.mockCall to simulate the XCM precompile
    // at 0x...000a0000. For live XCM testing, use the TestXCM.s.sol script
    // against the Polkadot Hub TestNet.

    address constant XCM_PRECOMPILE = 0x00000000000000000000000000000000000a0000;

    bytes constant XCM_MSG = hex"05040a"; // V5 + ClearOrigin

    /// @dev Deploy a real mock contract at the precompile address that:
    ///      1. Returns valid weight from weighMessage
    ///      2. Sends ETH to the caller (marketplace) during execute()
    function _mockXCMPrecompile(bytes memory xcmMsg, uint256 depositAmount) internal {
        // Deploy our mock and copy its runtime bytecode to the precompile address
        MockXCMPrecompile mock = new MockXCMPrecompile(address(marketplace), depositAmount);
        vm.etch(XCM_PRECOMPILE, address(mock).code);

        // Fund the precompile so it can send ETH during execute()
        if (depositAmount > 0) {
            vm.deal(XCM_PRECOMPILE, depositAmount);
        }

        // Copy the storage slots (target + depositAmount) from mock to precompile
        // Slot 0 = target address, Slot 1 = depositAmount
        vm.store(XCM_PRECOMPILE, bytes32(0), bytes32(uint256(uint160(address(marketplace)))));
        vm.store(XCM_PRECOMPILE, bytes32(uint256(1)), bytes32(depositAmount));

        // Mock weighMessage since the runtime code won't have our full logic
        vm.mockCall(
            XCM_PRECOMPILE,
            abi.encodeCall(IXcm.weighMessage, (xcmMsg)),
            abi.encode(uint64(1_000_000_000), uint64(65_536))
        );
    }

    function test_xcmPrecompileAddress() public view {
        assertEq(marketplace.XCM_PRECOMPILE(), XCM_PRECOMPILE);
    }

    // ── estimateXCMWeight ────────────────────────

    function test_estimateXCMWeight_success() public {
        vm.etch(XCM_PRECOMPILE, hex"00");
        vm.mockCall(
            XCM_PRECOMPILE,
            abi.encodeCall(IXcm.weighMessage, (XCM_MSG)),
            abi.encode(uint64(1_000_000_000), uint64(65_536))
        );

        (uint64 refTime, uint64 proofSize) = marketplace.estimateXCMWeight(XCM_MSG);
        assertEq(refTime, 1_000_000_000);
        assertEq(proofSize, 65_536);
    }

    function test_estimateXCMWeight_revertsOnFailure() public {
        // No precompile deployed → call returns false → XCMWeighFailed
        vm.expectRevert(HyperwayMarketplace.XCMWeighFailed.selector);
        marketplace.estimateXCMWeight(XCM_MSG);
    }

    // ── sendXCMMessage ───────────────────────────

    function test_sendXCMMessage_success() public {
        bytes memory destination = hex"0100";

        vm.etch(XCM_PRECOMPILE, hex"00");
        vm.mockCall(
            XCM_PRECOMPILE,
            abi.encodeCall(IXcm.send, (destination, XCM_MSG)),
            ""
        );

        vm.prank(owner);
        marketplace.sendXCMMessage(destination, XCM_MSG);
    }

    function test_sendXCMMessage_revertsNotOwner() public {
        vm.prank(buyer1);
        vm.expectRevert();
        marketplace.sendXCMMessage(hex"0100", XCM_MSG);
    }

    function test_sendXCMMessage_revertsOnPrecompileFailure() public {
        // Mock precompile to revert on any call
        vm.etch(XCM_PRECOMPILE, hex"00");
        vm.mockCallRevert(XCM_PRECOMPILE, bytes(""), bytes("revert"));

        vm.prank(owner);
        vm.expectRevert(HyperwayMarketplace.XCMSendFailed.selector);
        marketplace.sendXCMMessage(hex"0100", XCM_MSG);
    }

    // ── submitJobWithXCM ─────────────────────────

    function test_submitJobWithXCM_success() public {
        uint256 xcmDeposit = 1 ether;
        _mockXCMPrecompile(XCM_MSG, xcmDeposit);

        vm.prank(buyer1);
        uint256 jobId = marketplace.submitJobWithXCM(SPEC_CID, COMPUTE_UNITS, XCM_MSG);

        assertEq(jobId, 1);

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(job.buyer, buyer1);
        assertEq(job.paymentAmount, xcmDeposit);
        assertEq(job.specCID, SPEC_CID);
        assertEq(uint8(job.status), uint8(HyperwayMarketplace.JobStatus.PENDING));

        assertEq(marketplace.totalJobsCreated(), 1);
        assertEq(marketplace.totalVolumeEscrowed(), xcmDeposit);
    }

    function test_submitJobWithXCM_revertsWeighFails() public {
        // No precompile → weighMessage call returns false
        vm.prank(buyer1);
        vm.expectRevert(HyperwayMarketplace.XCMWeighFailed.selector);
        marketplace.submitJobWithXCM(SPEC_CID, COMPUTE_UNITS, XCM_MSG);
    }

    function test_submitJobWithXCM_revertsExecuteFails() public {
        vm.etch(XCM_PRECOMPILE, hex"00");

        // Mock weighMessage to succeed
        vm.mockCall(
            XCM_PRECOMPILE,
            abi.encodeCall(IXcm.weighMessage, (XCM_MSG)),
            abi.encode(uint64(1_000_000_000), uint64(65_536))
        );

        // Mock execute to revert
        vm.mockCallRevert(
            XCM_PRECOMPILE,
            abi.encodeCall(
                IXcm.execute,
                (XCM_MSG, IXcm.Weight(1_000_000_000, 65_536))
            ),
            ""
        );

        vm.prank(buyer1);
        vm.expectRevert(HyperwayMarketplace.XCMExecuteFailed.selector);
        marketplace.submitJobWithXCM(SPEC_CID, COMPUTE_UNITS, XCM_MSG);
    }

    function test_submitJobWithXCM_revertsNoFundsReceived() public {
        // Mock precompile to succeed but DON'T deposit any funds
        _mockXCMPrecompile(XCM_MSG, 0);

        vm.prank(buyer1);
        vm.expectRevert(HyperwayMarketplace.XCMNoFundsReceived.selector);
        marketplace.submitJobWithXCM(SPEC_CID, COMPUTE_UNITS, XCM_MSG);
    }

    /// @notice Full XCM job lifecycle: submit via XCM → assign → complete → pay out
    function test_xcmJobFullLifecycle() public {
        uint256 xcmDeposit = 2 ether;

        _registerProvider(provider1);
        _mockXCMPrecompile(XCM_MSG, xcmDeposit);

        // 1. Submit via XCM
        vm.prank(buyer1);
        uint256 jobId = marketplace.submitJobWithXCM(SPEC_CID, COMPUTE_UNITS, XCM_MSG);

        // 2. Provider claims
        vm.prank(provider1);
        marketplace.assignJob(jobId);

        // 3. Provider submits proof
        uint256 providerBalBefore = provider1.balance;

        vm.prank(provider1);
        marketplace.submitProof(jobId, RESULT_CID, PROOF_DATA);

        // 4. Verify payment
        uint256 expectedFee = (xcmDeposit * 250) / 10_000;
        uint256 expectedPayment = xcmDeposit - expectedFee;
        assertEq(provider1.balance - providerBalBefore, expectedPayment);

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(uint8(job.status), uint8(HyperwayMarketplace.JobStatus.COMPLETED));
        assertEq(job.paymentAmount, xcmDeposit);
        assertEq(marketplace.totalJobsCompleted(), 1);
    }

    // ──────────────────────────────────────────────
    //  ERC2771 Gasless (Meta-Transaction) Tests
    // ──────────────────────────────────────────────

    function test_trustedForwarder() public view {
        assertEq(marketplace.trustedForwarder(), address(forwarder));
        assertTrue(marketplace.isTrustedForwarder(address(forwarder)));
        assertFalse(marketplace.isTrustedForwarder(buyer1));
    }

    /// @dev Helper: build and sign a ForwardRequest, then execute via forwarder
    function _executeGasless(
        address from,
        uint256 privateKey,
        uint256 value,
        bytes memory data
    ) internal {
        ERC2771Forwarder.ForwardRequestData memory req = ERC2771Forwarder.ForwardRequestData({
            from: from,
            to: address(marketplace),
            value: value,
            gas: 1_000_000,
            deadline: uint48(block.timestamp + 1 hours),
            data: data,
            signature: "" // filled below
        });

        // Compute the EIP-712 digest
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce,uint48 deadline,bytes data)"),
                req.from,
                req.to,
                req.value,
                req.gas,
                forwarder.nonces(req.from),
                req.deadline,
                keccak256(req.data)
            )
        );

        bytes32 domainSeparator = _computeDomainSeparator();

        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", domainSeparator, structHash)
        );

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        req.signature = abi.encodePacked(r, s, v);

        // Fund the forwarder with value to forward
        if (value > 0) {
            vm.deal(address(this), value);
        }

        // Execute via forwarder (test contract acts as relayer)
        forwarder.execute{value: value}(req);
    }

    function _computeDomainSeparator() internal view returns (bytes32) {
        (
            ,
            string memory name,
            string memory version,
            uint256 chainId,
            address verifyingContract,
            ,

        ) = forwarder.eip712Domain();
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(name)),
                keccak256(bytes(version)),
                chainId,
                verifyingContract
            )
        );
    }

    function test_gaslessSubmitJob() public {
        // Submit job via forwarder — buyer1 signs, test contract relays
        _executeGasless(
            buyer1,
            buyer1Key,
            JOB_PAYMENT,
            abi.encodeCall(marketplace.submitJob, (SPEC_CID, COMPUTE_UNITS))
        );

        // Job should be created with buyer1 as the buyer (NOT the forwarder)
        HyperwayMarketplace.Job memory job = marketplace.getJob(1);
        assertEq(job.buyer, buyer1);
        assertEq(job.paymentAmount, JOB_PAYMENT);
        assertEq(uint8(job.status), uint8(HyperwayMarketplace.JobStatus.PENDING));
        assertEq(marketplace.totalJobsCreated(), 1);

        // Buyer's jobs should include this job
        uint256[] memory buyerJobIds = marketplace.getBuyerJobs(buyer1);
        assertEq(buyerJobIds.length, 1);
        assertEq(buyerJobIds[0], 1);
    }

    function test_gaslessRegisterProvider() public {
        // Register provider via forwarder — provider1 signs, test contract relays
        _executeGasless(
            provider1,
            provider1Key,
            STAKE_AMOUNT,
            abi.encodeCall(marketplace.registerProvider, (GPU_SPECS))
        );

        // Provider should be registered with correct address
        assertTrue(marketplace.isProvider(provider1));
        assertEq(marketplace.providerCount(), 1);

        HyperwayMarketplace.Provider memory p = marketplace.getProvider(provider1);
        assertEq(p.providerAddress, provider1);
        assertEq(p.stakedAmount, STAKE_AMOUNT);
        assertTrue(p.isActive);
    }

    function test_directCallsStillWork() public {
        // Normal (non-gasless) calls should still work exactly as before
        vm.prank(buyer1);
        uint256 jobId = marketplace.submitJob{value: JOB_PAYMENT}(SPEC_CID, COMPUTE_UNITS);

        HyperwayMarketplace.Job memory job = marketplace.getJob(jobId);
        assertEq(job.buyer, buyer1);
    }

    // ──────────────────────────────────────────────
    //  Helpers
    // ──────────────────────────────────────────────

    function _registerProvider(address provider) internal {
        vm.prank(provider);
        marketplace.registerProvider{value: STAKE_AMOUNT}(GPU_SPECS);
    }

    function _submitJob(address buyer) internal returns (uint256) {
        vm.prank(buyer);
        return
            marketplace.submitJob{value: JOB_PAYMENT}(SPEC_CID, COMPUTE_UNITS);
    }
}

/// @dev A mock XCM precompile that sends ETH to a target on execute() calls.
///      Deployed via vm.etch at the precompile address. Storage:
///      - Slot 0: target address (marketplace)
///      - Slot 1: deposit amount
contract MockXCMPrecompile {
    address public target;
    uint256 public depositAmount;

    constructor(address _target, uint256 _depositAmount) {
        target = _target;
        depositAmount = _depositAmount;
    }

    /// @dev Catches execute() calls and sends ETH to the marketplace
    fallback() external payable {
        // If this is an execute() call (selector 0xd3b7e04d) and we have funds, send them
        if (msg.data.length >= 4 && depositAmount > 0) {
            bytes4 selector = bytes4(msg.data[:4]);
            // execute(bytes,(uint64,uint64)) selector
            if (selector == 0xd3b7e04d) {
                (bool ok, ) = target.call{value: depositAmount}("");
                require(ok, "MockXCM: transfer failed");
            }
        }
    }

    receive() external payable {}
}
