//SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title BackingContract
 * @author Rosco Kalis <roscokalis@gmail.com>
 */
contract BackingContract {
    using SafeMath for uint256;

    uint256 public balanceForBacking;
    // IERC20BackwardsCompatible public immutable usdt;

    receive() external payable {
        balanceForBacking = balanceForBacking.add(msg.value);
    }

    constructor() {
        // usdt = IERC20BackwardsCompatible(_USDT);
    }

    /**
     * @notice Allows the backed token to deposit funds into the contract.
     * @dev Funds are added to balanceForBacking as well.
     */
    function deposit() external payable {
        balanceForBacking = balanceForBacking.add(msg.value);
    }

    /**
     * @notice Allows the backed token to withdraw funds from the contract.
     * @dev Funds are removed from balanceForBacking as well.
     * @param ethAmount The amount of eth to withdraw.
     */
    function withdraw(uint256 ethAmount) external {
        require(
            ethAmount <= address(this).balance,
            "Can not withdraw more than balance"
        );
        require(
            ethAmount <= balanceForBacking,
            "Can not withdraw more than balance for backing"
        );
        balanceForBacking = balanceForBacking.sub(ethAmount);
    }
}
