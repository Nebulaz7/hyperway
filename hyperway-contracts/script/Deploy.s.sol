// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {HyperwayMarketplace} from "../src/HyperwayMarketplace.sol";

/// @title Deploy Hyperway Marketplace
/// @notice Deployment script for Polkadot Hub (TestNet & Mainnet)
///
/// Usage:
///   # Deploy to Polkadot Hub TestNet
///   forge script script/Deploy.s.sol:DeployHyperway \
///     --chain polkadot-testnet \
///     --broadcast
///
///   # Deploy to Polkadot Hub Mainnet
///   forge script script/Deploy.s.sol:DeployHyperway \
///     --chain polkadot \
///     --broadcast
///
///   # Verify after deployment (Blockscout)
///   forge verify-contract <DEPLOYED_ADDRESS> \
///     src/HyperwayMarketplace.sol:HyperwayMarketplace \
///     --chain polkadot-testnet \
///     --constructor-args $(cast abi-encode "constructor(address)" <FEE_RECIPIENT>)
contract DeployHyperway is Script {
    function run() external {
        // Load deployer private key
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address feeRecipient = vm.envAddress("FEE_RECIPIENT");

        console.log("===========================================");
        console.log("  HYPERWAY MARKETPLACE - DEPLOYMENT");
        console.log("===========================================");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Fee Recipient:", feeRecipient);
        console.log("Chain ID:", block.chainid);
        console.log("-------------------------------------------");

        vm.startBroadcast(deployerPrivateKey);

        HyperwayMarketplace marketplace = new HyperwayMarketplace(feeRecipient);

        vm.stopBroadcast();

        console.log("-------------------------------------------");
        console.log("HyperwayMarketplace deployed to:", address(marketplace));
        console.log("Owner:", marketplace.owner());
        console.log("Fee Recipient:", marketplace.feeRecipient());
        console.log(
            "Platform Fee:",
            marketplace.platformFeeBps(),
            "bps (2.5%)"
        );
        console.log("Min Stake:", marketplace.minStakeAmount(), "wei");
        console.log("===========================================");
    }
}
