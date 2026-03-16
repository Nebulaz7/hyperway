// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";

// Simple ERC20 token for testing the USDT Escrow flow
contract DummyUSDT {
    string public name = "Tether USD (Testnet)";
    string public symbol = "USDT";
    uint8 public decimals = 6;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(uint256 initialSupply) {
        _mint(msg.sender, initialSupply);
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "ERC20: transfer amount exceeds balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(allowance[from][msg.sender] >= amount, "ERC20: insufficient allowance");
        require(balanceOf[from] >= amount, "ERC20: transfer amount exceeds balance");
        
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    // Allow anyone to mint for testing
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract DeployDummyUSDT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy with 100,000 USDT (6 decimals) minted to deployer
        DummyUSDT usdt = new DummyUSDT(100_000 * 10**6);
        
        console.log("-------------------------------------------");
        console.log("Dummy USDT deployed to:", address(usdt));
        console.log("Initial 100,000 USDT minted to:", deployerAddress);
        console.log("-------------------------------------------");

        vm.stopBroadcast();
    }
}
