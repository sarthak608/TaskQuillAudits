// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
contract VulnerableReentracny is Initializable, UUPSUpgradeable, OwnableUpgradeable, PausableUpgradeable {
    mapping(address => uint256) public balances;
    function initialize() public initializer {
        __Ownable_init();
        __Pausable_init();
    }
    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
    }
    function withdraw(uint256 _amount) external whenNotPaused {
        require(_amount <= balances[msg.sender], "Insufficient balance");
        // Vulnerable to reentrancy attack : here
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");
        balances[msg.sender] -= _amount;
    }
    // Pause and unpause functions : to start and pause the contract
    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    }
    // Upgradeability : to provide authorization
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}