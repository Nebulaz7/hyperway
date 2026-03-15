// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console2} from "forge-std/Script.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract CheckUSDT is Script {
    function run() public {
        // USDT mapped precompile on Polkadot Hub (Asset ID 1984)
        address usdtPrecompile = 0x000007c000000000000000000000000001200000;
        IERC20 usdt = IERC20(usdtPrecompile);
        
        address userAddress = msg.sender;
        if (vm.envExists("EVM_ACCOUNT")) {
             userAddress = vm.envAddress("EVM_ACCOUNT");
        }

        console2.log("Checking USDT on Polkadot Hub Testnet at", usdtPrecompile);
        console2.log("Target user address:", userAddress);

        try usdt.totalSupply() returns (uint256 supply) {
            console2.log("Total Supply:", supply);
        } catch {
             console2.log("Failed to get total supply.");
        }

        try usdt.balanceOf(userAddress) returns (uint256 bal) {
            console2.log("Balance of", userAddress, ":", bal);
        } catch {
             console2.log("Failed to get balance.");
        }
    }
}
