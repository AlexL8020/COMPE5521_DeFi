// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdfundingPlatform is Ownable {
    IERC20 public stableCoin;

    struct Campaign {
        address creator;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        bool claimed;
        bool active;
        mapping(address => uint256) contributions;
        address[] backers;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(
        uint256 campaignId,
        address creator,
        uint256 goal,
        uint256 deadline
    );
    event ContributionMade(
        uint256 campaignId,
        address contributor,
        uint256 amount
    );
    event FundsClaimed(uint256 campaignId, address creator, uint256 amount);
    event RefundIssued(uint256 campaignId, address contributor, uint256 amount);
    event CampaignCancelled(uint256 campaignId);

    // Event to emit the selector received by the fallback function
    event FallbackCalled(
        bytes4 selector,
        address sender,
        uint256 value,
        bytes data
    );

    constructor(address _stableCoinAddress) Ownable(msg.sender) {
        stableCoin = IERC20(_stableCoinAddress);
    }

    function createCampaign(
        uint256 _goal,
        uint256 _durationInDays
    ) external returns (uint256) {
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationInDays > 0, "Duration must be greater than 0");

        uint256 campaignId = campaignCount;
        Campaign storage newCampaign = campaigns[campaignId];

        newCampaign.creator = msg.sender;
        newCampaign.goal = _goal;
        newCampaign.deadline = block.timestamp + (_durationInDays * 1 days);
        newCampaign.active = true;

        campaignCount++;

        emit CampaignCreated(
            campaignId,
            msg.sender,
            _goal,
            newCampaign.deadline
        );

        return campaignId;
    }

    function contribute(uint256 _campaignId, uint256 _amount) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(campaign.active, "Campaign is not active");
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(_amount > 0, "Contribution must be greater than 0");

        // Transfer tokens from contributor to contract
        require(
            stableCoin.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );

        // If this is the first contribution from this address, add to backers array
        if (campaign.contributions[msg.sender] == 0) {
            campaign.backers.push(msg.sender);
        }

        campaign.contributions[msg.sender] += _amount;
        campaign.amountRaised += _amount;

        emit ContributionMade(_campaignId, msg.sender, _amount);
    }

    function claimFunds(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(msg.sender == campaign.creator, "Only creator can claim funds");
        require(campaign.active, "Campaign is not active");
        require(
            block.timestamp >= campaign.deadline,
            "Campaign has not ended yet"
        );
        require(campaign.amountRaised >= campaign.goal, "Goal not reached");
        require(!campaign.claimed, "Funds already claimed");

        campaign.claimed = true;
        campaign.active = false;

        require(
            stableCoin.transfer(campaign.creator, campaign.amountRaised),
            "Token transfer failed"
        );

        emit FundsClaimed(_campaignId, campaign.creator, campaign.amountRaised);
    }

    function getRefund(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(campaign.active, "Campaign is not active");
        require(
            block.timestamp >= campaign.deadline,
            "Campaign has not ended yet"
        );
        require(
            campaign.amountRaised < campaign.goal,
            "Goal was reached, no refunds"
        );

        uint256 contributionAmount = campaign.contributions[msg.sender];
        require(contributionAmount > 0, "No contribution found");

        campaign.contributions[msg.sender] = 0;

        require(
            stableCoin.transfer(msg.sender, contributionAmount),
            "Token transfer failed"
        );

        emit RefundIssued(_campaignId, msg.sender, contributionAmount);
    }

    function cancelCampaign(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(
            msg.sender == campaign.creator || msg.sender == owner(),
            "Only creator or owner can cancel"
        );
        require(campaign.active, "Campaign is not active");

        campaign.active = false;

        emit CampaignCancelled(_campaignId);
    }

    // View functions
    function getCampaignDetails(
        uint256 _campaignId
    )
        external
        view
        returns (
            address creator,
            uint256 goal,
            uint256 deadline,
            uint256 amountRaised,
            bool claimed,
            bool active
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.goal,
            campaign.deadline,
            campaign.amountRaised,
            campaign.claimed,
            campaign.active
        );
    }

    function getContribution(
        uint256 _campaignId,
        address _contributor
    ) external view returns (uint256) {
        return campaigns[_campaignId].contributions[_contributor];
    }

    function getCampaignBackers(
        uint256 _campaignId
    ) external view returns (address[] memory) {
        return campaigns[_campaignId].backers;
    }

    receive() external payable {
        // You could add logic here if needed, e.g., emit an event
        // console.log("Receive() called with value:", msg.value);
    }

    /**
     * @dev Fallback function to catch calls with unrecognized selectors or plain ETH transfers.
     * Emits an event with the received function selector (msg.sig) for debugging.
     * It's marked payable to also catch direct ETH sends if any occur, though
     * the primary goal here is to catch unrecognized function calls during simulation.
     */
    fallback() external payable {
        // console.log("Fallback triggered by:", msg.sender); // Uncomment for Hardhat console logging
        // console.log("   Selector (msg.sig):", msg.sig);
        // console.log("   Value (msg.value):", msg.value);
        // console.log("   Data (msg.data):", msg.data);
        emit FallbackCalled(msg.sig, msg.sender, msg.value, msg.data);
    }
}
