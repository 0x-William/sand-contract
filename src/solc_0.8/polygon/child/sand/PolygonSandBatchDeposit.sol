//SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

import "@openzeppelin/contracts-0.8/access/Ownable.sol";
import "./interfaces/IPolygonSand.sol";

contract PolygonSandBatchDeposit is Ownable {
    IPolygonSand internal immutable _polygonSand;

    constructor(IPolygonSand polygonSand) {
        _polygonSand = polygonSand;
    }

    /**
     * @notice Mints the given value of sand to respective holder on polygonSand contract
     * @param holders Array of token holder addresses
     * @param values Array of Amount of tokens to be minted for corresponding addresses
     */
    function batchMint(address[] calldata holders, uint256[] calldata values) external onlyOwner {
        require(holders.length == values.length, "Number of holders should be equal to number of values");
        for (uint256 i = 0; i < holders.length; i++) {
            _polygonSand.deposit(holders[i], abi.encode(values[i]));
        }
    }

    /**
     * @notice Transfers the given value of sand to respective address
     * @param users Array of user addresses
     * @param amounts Array of Amount of tokens to be transferred
     */
    function batchTransfer(address[] calldata users, uint256[] calldata amounts) external onlyOwner {
        require(users.length == amounts.length, "Number of users should be equal to number of amounts");
        for (uint256 i = 0; i < users.length; i++) {
            _polygonSand.transfer(users[i], amounts[i]);
        }
    }
}
