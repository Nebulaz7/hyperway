const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Hardcoded env values just in case dotenv is not installed
const PRIVATE_KEY = "0x5d0eb4cde25721371d647e674675b9433a21fa42232757f82605430e2fb7e19e";
const FEE_RECIPIENT = "0x88f713A8d2BF0CFD51f84F3E1cbcef04493547fe";
const RPC_URL = "https://eth-rpc-testnet.polkadot.io/";

async function main() {
    console.log("Starting deployment...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("Deployer:", wallet.address);
    console.log("Fee Recipient:", FEE_RECIPIENT);
    console.log("RPC:", RPC_URL);

    // 1. Deploy Forwarder
    console.log("\nDeploying ERC2771Forwarder...");
    const forwarderJson = JSON.parse(fs.readFileSync(path.join(__dirname, "out/ERC2771Forwarder.sol/ERC2771Forwarder.json"), "utf8"));
    const ForwarderFactory = new ethers.ContractFactory(forwarderJson.abi, forwarderJson.bytecode.object, wallet);
    const forwarder = await ForwarderFactory.deploy("HyperwayForwarder");
    await forwarder.waitForDeployment();
    const forwarderAddress = await forwarder.getAddress();
    console.log("ERC2771Forwarder deployed to:", forwarderAddress);

    // 2. Deploy Marketplace
    console.log("\nDeploying HyperwayMarketplace...");
    const marketplaceJson = JSON.parse(fs.readFileSync(path.join(__dirname, "out/HyperwayMarketplace.sol/HyperwayMarketplace.json"), "utf8"));
    const MarketplaceFactory = new ethers.ContractFactory(marketplaceJson.abi, marketplaceJson.bytecode.object, wallet);
    const marketplace = await MarketplaceFactory.deploy(FEE_RECIPIENT, forwarderAddress);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    console.log("HyperwayMarketplace deployed to:", marketplaceAddress);

    console.log("\n===========================================");
    console.log("Deployment Successful!");
    console.log("===========================================");
}

main().catch(console.error);
