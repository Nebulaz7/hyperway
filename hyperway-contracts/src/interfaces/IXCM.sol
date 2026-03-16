// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title IXcm - Interface for the XCM precompile on Polkadot Hub
/// @notice Provides cross-chain messaging capabilities to Solidity contracts
/// @dev Located at 0x00000000000000000000000000000000000a0000
///
///      ═══════════════════════════════════════════════════════
///      IMPORTANT — Raw XCM V5 Payloads (No VersionedXcm Wrapper)
///      ═══════════════════════════════════════════════════════
///
///      The Polkadot Hub XCM precompile strictly enforces XCM V5
///      and has DEPRECATED the VersionedXcm enum wrapper.
///
///      Callers MUST supply raw, SCALE-encoded XCM instruction sets
///      directly — NOT wrapped in VersionedXcm::V5(…).
///
///      Legacy functions (xcmSend, xcmExecute) have been renamed:
///        • xcmSend    → send     (selector 0x7f0a3bf9)
///        • xcmExecute → execute  (selector 0xd3b7e04d)
///
///      Key XCM V5 instruction opcodes (SCALE-encoded):
///        0x00 — WithdrawAsset
///        0x02 — DepositAsset
///        0x08 — TransferAsset
///        0x0a — ClearOrigin
///        0x13 — Transact
///
///      Reference: Polkadot Hub Architectural Analysis §5.2–5.3
interface IXcm {
    /// @notice Weight represents the computational cost of executing an XCM message
    /// @param refTime Reference time weight (analogous to gas in EVM)
    /// @param proofSize Proof size weight (storage proof overhead)
    struct Weight {
        uint64 refTime;
        uint64 proofSize;
    }

    /// @notice Execute a raw XCM V5 instruction set locally
    /// @dev The message is executed on the current chain with the caller's origin.
    ///
    ///      BREAKING CHANGE: This function was previously named `xcmExecute`.
    ///      The new ABI selector is 0xd3b7e04d.
    ///
    ///      The `message` parameter MUST be raw SCALE-encoded XCM V5
    ///      instructions — NOT wrapped in VersionedXcm.
    ///
    /// @param message Raw SCALE-encoded XCM V5 instruction bytes
    /// @param weight Maximum weight budget for execution
    function execute(bytes calldata message, Weight calldata weight) external;

    /// @notice Send a raw XCM V5 instruction set to another consensus system
    /// @dev Routes the message through the Relay Chain to the destination.
    ///
    ///      BREAKING CHANGE: This function was previously named `xcmSend`.
    ///      The new ABI selector is 0x7f0a3bf9.
    ///
    ///      Common destinations (SCALE-encoded MultiLocation):
    ///        Asset Hub:   {parents: 1, interior: X1(Parachain(1000))}
    ///        Relay Chain: {parents: 1, interior: Here}
    ///        People Chain:{parents: 1, interior: X1(Parachain(1004))}
    ///
    /// @param destination SCALE-encoded MultiLocation of the target chain
    /// @param message Raw SCALE-encoded XCM V5 instruction bytes
    function send(bytes calldata destination, bytes calldata message) external;

    /// @notice Estimate the weight required to execute a raw XCM V5 instruction set
    /// @dev Use this to calculate weight budgets before calling execute().
    ///      The returned weight should be passed directly to execute() or
    ///      used to construct a BuyExecution instruction for send().
    ///
    /// @param message Raw SCALE-encoded XCM V5 instruction bytes
    /// @return weight The estimated Weight (refTime + proofSize)
    function weighMessage(
        bytes calldata message
    ) external returns (Weight memory weight);
}
