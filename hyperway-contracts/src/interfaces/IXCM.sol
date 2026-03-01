// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title IXcm - Interface for the XCM precompile on Polkadot Hub / Asset Hub
/// @notice Provides cross-chain messaging capabilities to Solidity contracts
/// @dev Located at 0x00000000000000000000000000000000000a0000
///
///      Reference implementation:
///      https://github.com/brunopgalvao/recipe-contracts-precompile-example
///
///      XCM messages MUST be SCALE-encoded VersionedXcm::V5 format.
///      Example: 0x05040a = V5 prefix (0x05) + 1-item vec (0x04) + ClearOrigin (0x0a)
///
///      Key XCM V5 instruction opcodes (SCALE-encoded):
///      - 0x0a: ClearOrigin
///      - 0x00: WithdrawAsset
///      - 0x02: DepositAsset
///      - 0x08: TransferAsset
///      - 0x13: Transact
interface IXcm {
    /// @notice Weight represents the computational cost of executing an XCM message
    /// @param refTime Reference time weight (analogous to gas in EVM)
    /// @param proofSize Proof size weight (storage proof overhead)
    struct Weight {
        uint64 refTime;
        uint64 proofSize;
    }

    /// @notice Execute an XCM message locally with the caller's origin
    /// @dev The message is executed on the current chain. Useful for:
    ///      - WithdrawAsset: Pull tokens from a sovereign account
    ///      - DepositAsset: Deposit tokens into a local account
    ///      - Transact: Execute an arbitrary call
    /// @param message SCALE-encoded VersionedXcm::V5 message bytes
    /// @param weight Maximum weight budget for execution
    function execute(bytes calldata message, Weight calldata weight) external;

    /// @notice Send an XCM message to another parachain or consensus system
    /// @dev Used for cross-chain communication. The destination is a SCALE-encoded
    ///      MultiLocation identifying the target chain.
    ///      Example destinations:
    ///      - Asset Hub: {parents: 1, interior: {X1: {Parachain: 1000}}}
    ///      - Relay chain: {parents: 1, interior: Here}
    /// @param destination SCALE-encoded MultiLocation of the target chain
    /// @param message SCALE-encoded VersionedXcm::V5 message to deliver
    function send(bytes calldata destination, bytes calldata message) external;

    /// @notice Estimate the weight required to execute an XCM message
    /// @dev Use this to calculate weight budgets before calling execute().
    ///      Weight scales linearly with the number of XCM instructions.
    /// @param message SCALE-encoded VersionedXcm::V5 message to weigh
    /// @return weight The estimated Weight (refTime + proofSize)
    function weighMessage(
        bytes calldata message
    ) external view returns (Weight memory weight);
}
