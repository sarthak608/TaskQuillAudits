// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    // Mapping to store user balances
    mapping(address => uint256) public balances;
    
    // Event to log deposits
    event Deposit(address indexed user, uint256 amount);
    
    // Event to log withdrawals
    event Withdrawal(address indexed user, uint256 amount);

    // Function to deposit Ether into the contract
    function deposit() external payable {
        require(msg.value > 0, "Must send some Ether");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Function to withdraw Ether from the contract
    function withdraw(uint256 amount) external {
        require(amount <= balances[msg.sender], "Insufficient balance");

        // Reentrancy vulnerability
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= amount;
        emit Withdrawal(msg.sender, amount);
    }

    // Function to withdraw all Ether from the contract
    function withdrawAll() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        // Incorrect balance handling (amount should be deducted before transfer)
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] = 0; // Vulnerable to reentrancy
        emit Withdrawal(msg.sender, amount);
    }

    // Function to set an admin address (no access control)
    address public admin;

    function setAdmin(address _admin) external {
        admin = _admin;
    }

    // Function to withdraw funds as admin (access control vulnerability)
    function adminWithdraw(uint256 amount) external {
        require(msg.sender == admin, "Not authorized");
        require(amount <= address(this).balance, "Insufficient contract balance");

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}
