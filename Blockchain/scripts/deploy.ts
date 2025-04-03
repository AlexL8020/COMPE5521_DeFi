import { ethers } from "hardhat";

async function main() {
  // Deploy MockStableCoin
  const MockStableCoin = await ethers.getContractFactory("MockStableCoin");
  const mockStableCoin = await MockStableCoin.deploy();

  // Wait for deployment to complete
  await mockStableCoin.deploymentTransaction()?.wait();

  // Get the contract address
  const mockStableCoinAddress = await mockStableCoin.getAddress();
  console.log(`MockStableCoin deployed to: ${mockStableCoinAddress}`);

  // Deploy CrowdfundingPlatform with MockStableCoin address
  const CrowdfundingPlatform = await ethers.getContractFactory(
    "CrowdfundingPlatform"
  );
  const crowdfundingPlatform = await CrowdfundingPlatform.deploy(
    mockStableCoinAddress
  );

  // Wait for deployment to complete
  await crowdfundingPlatform.deploymentTransaction()?.wait();

  // Get the contract address
  const crowdfundingPlatformAddress = await crowdfundingPlatform.getAddress();
  console.log(
    `CrowdfundingPlatform deployed to: ${crowdfundingPlatformAddress}`
  );

  // Save the contract addresses for future reference
  console.log(
    "Contract addresses:",
    JSON.stringify(
      {
        mockStableCoin: mockStableCoinAddress,
        crowdfundingPlatform: crowdfundingPlatformAddress,
      },
      null,
      2
    )
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
