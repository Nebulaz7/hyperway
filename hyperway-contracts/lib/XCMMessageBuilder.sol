// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title XCMMessageBuilder
/// @notice Helper library for constructing SCALE-encoded XCM V5 messages
/// @dev XCM messages on Polkadot Hub must be VersionedXcm::V5 format.
///      SCALE encoding reference: https://docs.substrate.io/reference/scale-codec/
///
///      This library provides pre-built message templates for common operations.
///      For production use, construct messages off-chain with Polkadot.js or
///      the PAPI (Polkadot API) and pass them as calldata.
///
///      XCM V5 message structure:
///      - 0x05 = Version prefix (V5)
///      - SCALE-encoded compact length of instruction array
///      - Concatenated SCALE-encoded instructions
library XCMMessageBuilder {
    // ──────────────────────────────────────────────
    //  XCM V5 Constants
    // ───────────────��──────────────────────────────

    /// @dev XCM V5 version prefix
    bytes1 internal constant V5_PREFIX = 0x05;

    // Instruction opcodes (first byte of each SCALE-encoded instruction)
    uint8 internal constant WITHDRAW_ASSET = 0x00;
    uint8 internal constant RESERVE_ASSET_DEPOSITED = 0x01;
    uint8 internal constant DEPOSIT_ASSET = 0x02;
    uint8 internal constant CLEAR_ORIGIN = 0x0a;
    uint8 internal constant BUY_EXECUTION = 0x0c;
    uint8 internal constant TRANSFER_ASSET = 0x08;

    // ──────────────────────────────────────────────
    //  Message Templates
    // ──────────────────────────────────────────────

    /// @notice Build a simple ClearOrigin message (useful for testing)
    /// @return message SCALE-encoded XCM V5 message
    function buildClearOrigin() internal pure returns (bytes memory) {
        return hex"05040a"; // V5 + 1 instruction + ClearOrigin
    }

    /// @notice Build an empty XCM V5 message (useful for weight estimation baseline)
    /// @return message SCALE-encoded empty XCM V5 message
    function buildEmpty() internal pure returns (bytes memory) {
        return hex"0500"; // V5 + 0 instructions
    }

    /// @notice Wrap raw XCM instruction bytes with V5 version prefix
    /// @dev Use this when you have pre-built instruction bytes from off-chain
    /// @param instructionCount Compact-encoded count of instructions
    /// @param instructions Concatenated SCALE-encoded instruction bytes
    /// @return message Complete SCALE-encoded XCM V5 message
    function wrapV5(
        bytes1 instructionCount,
        bytes memory instructions
    ) internal pure returns (bytes memory) {
        return abi.encodePacked(V5_PREFIX, instructionCount, instructions);
    }

    // ──────────────────────────────────────────────
    //  MultiLocation Builders
    // ──────────────────────────────────────────────

    /// @notice Build MultiLocation for the relay chain (Polkadot)
    /// @dev {parents: 1, interior: Here} = 0x0100
    /// @return location SCALE-encoded MultiLocation
    function relayChain() internal pure returns (bytes memory) {
        return hex"0100"; // parents=1, interior=Here(0x00)
    }

    /// @notice Build MultiLocation for a sibling parachain
    /// @dev {parents: 1, interior: {X1: {Parachain: paraId}}}
    /// @param paraId The parachain ID (e.g., 1000 for Asset Hub)
    /// @return location SCALE-encoded MultiLocation
    function siblingParachain(
        uint32 paraId
    ) internal pure returns (bytes memory) {
        // parents=1, interior=X1(0x01), Parachain junction(0x00), paraId as LE u32
        return
            abi.encodePacked(
                bytes1(0x01), // parents = 1
                bytes1(0x01), // interior = X1
                bytes1(0x00), // Parachain junction type
                _encodeU32LE(paraId)
            );
    }

    /// @notice Build MultiLocation for Asset Hub specifically
    /// @return location SCALE-encoded MultiLocation for Asset Hub (paraId 1000)
    function assetHub() internal pure returns (bytes memory) {
        return siblingParachain(1000);
    }

    // ──────────────────────────────────────────────
    //  Internal Helpers
    // ──────────────────────────────────────────────

    /// @dev Encode a uint32 in little-endian format (SCALE encoding)
    function _encodeU32LE(uint32 value) private pure returns (bytes4) {
        return
            bytes4(
                bytes4(uint32(value & 0xFF) << 24) |
                    bytes4(uint32((value >> 8) & 0xFF) << 16) |
                    bytes4(uint32((value >> 16) & 0xFF) << 8) |
                    bytes4(uint32((value >> 24) & 0xFF))
            );
    }
}
