// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title ISystem - Interface for the System precompile on Polkadot Hub
/// @notice Provides account ID conversion between H160 (EVM) and AccountId32 (Substrate)
/// @dev Located at 0x0000000000000000000000000000000000000900
///
///      The Polkadot Hub uses two address formats:
///        • H160 (20 bytes) — Ethereum-style, used by EVM contracts and EOAs
///        • AccountId32 (32 bytes) — Substrate-native, used by pallets and XCM
///
///      H160 addresses are automatically mapped to AccountId32 by padding with 0xEE:
///        H160:       0x1234...5678
///        AccountId32: 0x1234...5678EEEEEEEEEEEEEEEEEEEEEEEE
///
///      This precompile exposes the deterministic mapping so that contracts
///      can construct XCM messages with correct Substrate account targets.
///
///      Reference: Polkadot Hub Architectural Analysis §2
interface ISystem {
    /// @notice Convert an H160 EVM address to a Substrate AccountId32
    /// @dev The returned bytes32 can be used directly in XCM instructions
    ///      that require an AccountId32 beneficiary (e.g., DepositAsset).
    /// @param evmAddress The 20-byte Ethereum address to convert
    /// @return accountId32 The 32-byte Substrate account identifier
    function toAccountId(
        address evmAddress
    ) external view returns (bytes32 accountId32);
}
