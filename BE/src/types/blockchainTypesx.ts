// Define a type for the raw data returned from the smart contract
export type RawCampaignDetails = [
  string, // creator address line 18
  bigint, // goal
  bigint, // deadline
  bigint, // amountRaised
  boolean, // claimed
  boolean, // active line 23
  string // frontendTrackerId (not in the original contract, but added for frontend tracking)
];
// based on CrowdfundingPlatform.sol
// function getCampaignDetails(
//     uint256 _campaignId
// )
// ...
// {
// ...
//     return (
//         campaign.creator,
//         campaign.goal,
//         campaign.deadline,
//         campaign.amountRaised,
//         campaign.claimed,
//         campaign.active
//     );
// }

// Define a type for the processed campaign details
export type CampaignDetails = {
  creator: string;
  goal: string;
  deadline: number;
  amountRaised: string;
  claimed: boolean;
  active: boolean;
  frontendTrackerId: string; // This is the ID used in the frontend to track the campaign
};
