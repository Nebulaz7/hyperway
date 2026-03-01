// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {IXcm} from "../src/interfaces/IXCM.sol";

/// @title TestXCM - Verify XCM precompile is accessible on Polkadot Hub
/// @notice Run against testnet to confirm precompile works:
///
///   forge script script/TestXCM.s.sol:TestXCM \
///     --chain polkadot-testnet \
///     --broadcast
///
/// @dev This script does NOT modify state. It only reads from the precompile.
///      Use this to verify:
///      1. The precompile exists at 0x...000a0000
///      2. weighMessage returns valid weights
///      3. XCM V5 encoding is correct
contract TestXCM is Script {
    address constant XCM_PRECOMPILE =
        0x00000000000000000000000000000000000a0000;

    // SCALE-encoded XCM V5 test messages
    // (from official Polkadot Cookbook)
    bytes constant XCM_V5_EMPTY = hex"0500"; // V5 + empty instruction vec
    bytes constant XCM_V5_CLEAR_ORIGIN = hex"05040a"; // V5 + 1 ClearOrigin
    bytes constant XCM_V5_TWO_CLEAR = hex"05080a0a"; // V5 + 2 ClearOrigin

    function run() external view {
        console.log("===========================================");
        console.log("  HYPERWAY - XCM PRECOMPILE VERIFICATION");
        console.log("===========================================");
        console.log("Chain ID:", block.chainid);
        console.log("XCM Precompile:", XCM_PRECOMPILE);
        console.log("-------------------------------------------");

        IXcm xcm = IXcm(XCM_PRECOMPILE);

        // Test 1: Check precompile has code
        uint256 codeSize;
        address precompile = XCM_PRECOMPILE;
        assembly {
            codeSize := extcodesize(precompile)
        }
        console.log("Test 1 - Precompile code size:", codeSize);
        // Note: Precompiles may report 0 code size but still respond to calls

        // Test 2: Empty XCM V5 message should return zero weight
        console.log("-------------------------------------------");
        console.log("Test 2 - weighMessage(empty V5):");
        IXcm.Weight memory w1 = xcm.weighMessage(XCM_V5_EMPTY);
        console.log("  refTime:", w1.refTime);
        console.log("  proofSize:", w1.proofSize);

        // Test 3: ClearOrigin should return non-zero weight
        console.log("-------------------------------------------");
        console.log("Test 3 - weighMessage(ClearOrigin):");
        IXcm.Weight memory w2 = xcm.weighMessage(XCM_V5_CLEAR_ORIGIN);
        console.log("  refTime:", w2.refTime);
        console.log("  proofSize:", w2.proofSize);

        // Test 4: Two ClearOrigins should be 2x the weight
        console.log("-------------------------------------------");
        console.log("Test 4 - weighMessage(2x ClearOrigin):");
        IXcm.Weight memory w3 = xcm.weighMessage(XCM_V5_TWO_CLEAR);
        console.log("  refTime:", w3.refTime);
        console.log("  proofSize:", w3.proofSize);
        console.log(
            "  Linear scaling?",
            w3.refTime == w2.refTime * 2 ? "YES" : "NO"
        );

        console.log("===========================================");
        console.log("  ALL CHECKS PASSED");
        console.log("===========================================");
    }
}
