// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title IXCM - Interface for the Polkadot Hub XCM Precompile
/// @notice Allows Solidity contracts to send and execute XCM messages
/// @dev The XCM precompile is deployed at a fixed address on Polkadot Hub.
///      This interface provides access to cross-chain messaging capabilities
///      including cross-chain asset transfers and remote execution.
///
///      Reference: https://docs.polkadot.com/smart-contracts/precompiles/xcm/
///      Precompile address: 0x0000000000000000000000000000000000000804
interface IXCM {
    /// @notice Execute an XCM message locally
    /// @param message The SCALE-encoded XCM message to execute
    /// @param maxWeight The maximum weight (gas equivalent) allowed for execution
    /// @return success Whether the execution succeeded
    function execute(bytes memory message, uint64 maxWeight) external returns (bool success);

    /// @notice Send an XCM message to another consensus system (parachain)
    /// @param dest The SCALE-encoded MultiLocation of the destination
    /// @param message The SCALE-encoded XCM message to send
    /// @return success Whether the send succeeded
    function send(bytes memory dest, bytes memory message) external returns (bool success);

    /// @notice Estimate the weight required to execute an XCM message
    /// @param message The SCALE-encoded XCM message to weigh
    /// @return weight The estimated weight for execution
    function weighMessage(bytes memory message) external view returns (uint64 weight);
}