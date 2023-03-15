//SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "./BackingContract.sol";
import "./Staker.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Roulette is Pausable, BackingContract {
    error InvalidRange(uint256 _from, uint256 _to);

    using SafeMath for uint256;
    Staker public staker;
    struct PlayerInfo {
        address payable player;
        uint256 betSize;
        uint256 betNumber;
    }

    constructor(address stakerContractAddress) {
        staker = Staker(stakerContractAddress);
    }

    mapping(address => PlayerInfo) players;
    mapping(address => bytes32) playerRequestId;
    event Bet(address indexed player, uint256 betSize, uint256 betNumber);
    event GameStart(bytes32 requestId);
    event Play(uint256 winningNumber);
    event Payout(address indexed winner, uint256 payout);

    function play() public {
        bytes32 _requestId = staker.makeRequestUint256();
        emit GameStart(_requestId);
        playerRequestId[msg.sender] = _requestId;
    }

    /**
     * @notice Bets an amount of eth on a specific number.
     * @dev Updates token price according to value change.
     * @dev Stores the player info in `players` mapping so it can be retrieved in `__callback()`.
     * @dev Emits Bet event.
     * @param number The number that is bet on.
     */
    function bet(uint256 number) external payable whenNotPaused {
        require(
            msg.value <= maxBet(),
            "Bet amount can not exceed max bet size"
        );
        uint256 betValue = msg.value;
        players[msg.sender] = PlayerInfo(payable(msg.sender), betValue, number);
        emit Bet(msg.sender, betValue, number);
        play();
    }

    function rollFromToInclusive(
        uint256 _rng,
        uint256 _from,
        uint256 _to
    ) public pure returns (uint256) {
        _to++;
        if (_from >= _to) {
            revert InvalidRange(_from, _to);
        }
        return (_rng % _to) + _from;
    }

    /**
     * @notice Callback function for Oraclize, checks if the player won the bet, and payd out if they did.
     * @dev Uses the `players` mapping to retrieve a player's information, deletes the player information afterwards.
     * @dev Emits Play event.
  
     */
    function executeResult(uint256 randomNumber) external {
        uint256 _roll = rollFromToInclusive(randomNumber, 0, 36);

        emit Play(_roll);
        balanceForBacking = balanceForBacking.add(playerInfo.betSize);

        if (playerInfo.betNumber == _roll) {
            address payable playerAddress = playerInfo.player;
            uint256 payoutAmount = playerInfo.betSize.mul(36);
            payout(playerAddress, payoutAmount);
        }
    }

    /**
     * @notice Pays out an amount of eth to a bet winner.
     * @dev Updates token price according to value change.
     * @dev Emits Payout event.
     
     * @param amount The amount to be paid out to the bet winner.
     */
    function payout(address payable winner, uint256 amount) internal {
        require(amount > 0, "Payout amount should be more than 0");
        require(
            amount <= address(this).balance,
            "Payout amount should not be more than contract balance"
        );
        balanceForBacking = balanceForBacking.sub(amount);
        (bool success, ) = winner.call{value: amount}("");
        require(success, "Could not payout to the winner.");
        emit Payout(winner, amount);
    }

    /**
     * @notice Returns the maximum bet (0.5% of balance) for this contract.
     * @dev Based on empirical statistics (see docs/max_bet_size.md).
     * @return The maximum bet.
     */
    function maxBet() public view returns (uint256) {
        return balanceForBacking.div(200) + oraclizeFeeEstimate();
    }

    /**
     * @notice Returns an estimate of the oraclize fee.
     * @return An estimate of the oraclize fee.
     */
    function oraclizeFeeEstimate() public pure returns (uint256) {
        return 0.00017 ether;
    }

    function getPlayerInfo(address player) public view {
        players[player];
    }
}
