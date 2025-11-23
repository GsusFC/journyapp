// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title JournyLog
 * @dev Contract for logging encrypted journal entries (IPFS CIDs) and tracking user streaks.
 *      Implements "Privacy First" by storing only CIDs, not content.
 */
contract JournyLog is ReentrancyGuard, Pausable, Ownable {
    // --- State Variables ---

    // Stores the history of IPFS CIDs for each user.
    // Using string[] because IPFS CIDs (v0/v1) are typically larger than bytes32.
    mapping(address => string[]) private userEntries;

    // Timestamp of the last entry for streak calculation.
    // uint32 is sufficient until year 2106.
    mapping(address => uint32) public lastEntryTimestamp;

    // Current streak count.
    // uint16 is sufficient for ~179 years of daily streaks.
    mapping(address => uint16) public currentStreak;

    // --- Events ---

    event EntryLogged(
        address indexed user,
        string cid,
        uint256 timestamp,
        uint16 streak
    );

    // --- Constructor ---

    constructor() Ownable(msg.sender) {}

    // --- Core Functions ---

    /**
     * @notice Logs a new journal entry and updates the user's streak.
     * @param _cid The IPFS Content Identifier of the encrypted entry.
     */
    function logEntry(string calldata _cid) external nonReentrant whenNotPaused {
        require(bytes(_cid).length > 0, "CID cannot be empty");

        address user = msg.sender;
        uint32 lastTimestamp = lastEntryTimestamp[user];
        uint256 currentTimestamp = block.timestamp;
        
        // Calculate time difference
        // If lastTimestamp is 0, it's the first entry.
        uint256 dt = lastTimestamp == 0 ? 0 : currentTimestamp - lastTimestamp;

        // Streak Logic
        if (lastTimestamp == 0) {
            // First ever entry
            currentStreak[user] = 1;
        } else {
            if (dt < 24 hours) {
                // Less than 24h passed.
                // We allow logging multiple times a day, but streak doesn't increase.
                // Keep the same streak.
            } else if (dt >= 24 hours && dt <= 48 hours) {
                // Between 24h and 48h: Streak continues.
                currentStreak[user]++;
            } else {
                // More than 48h: Streak reset.
                currentStreak[user] = 1;
            }
        }

        // Update state
        userEntries[user].push(_cid);
        lastEntryTimestamp[user] = uint32(currentTimestamp);

        emit EntryLogged(user, _cid, currentTimestamp, currentStreak[user]);
    }

    /**
     * @notice Checks if a user is eligible for the Clanker integration (Token deployment).
     * @param _user The address of the user to check.
     * @return True if the user has a streak of 30 or more.
     */
    function isEligibleForClanker(address _user) external view returns (bool) {
        return currentStreak[_user] >= 30;
    }

    /**
     * @notice Returns the total number of entries for a user.
     * @param _user The user address.
     */
    function getEntryCount(address _user) external view returns (uint256) {
        return userEntries[_user].length;
    }

    /**
     * @notice Returns a specific entry CID for a user.
     * @param _user The user address.
     * @param _index The index of the entry.
     */
    function getEntry(address _user, uint256 _index) external view returns (string memory) {
        require(_index < userEntries[_user].length, "Index out of bounds");
        return userEntries[_user][_index];
    }

    // --- Admin Functions ---

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
