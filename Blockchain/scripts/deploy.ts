import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

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


  // --- Add ABI Copying Logic ---
  console.log("Copying ABI to frontend...");

  const abiSourceDir = path.join(__dirname, "../artifacts/contracts");
  const abiDestDir = path.join(__dirname, "../../FE/lib/contracts/abis"); // Example destination

  try {
    // Ensure destination directory exists
    if (!fs.existsSync(abiDestDir)) {
      fs.mkdirSync(abiDestDir, { recursive: true });
      console.log(`Created frontend ABI directory: ${abiDestDir}`);
    }

    // Define specific ABIs to copy
    const filesToCopy = [
      "CrowdfundingPlatform.sol/CrowdfundingPlatform.json",
      // Add other ABIs if needed, e.g., "MockStableCoin.sol/MockStableCoin.json"
    ];

    for (const file of filesToCopy) {
      const sourcePath = path.join(abiSourceDir, file);
      const destPath = path.join(abiDestDir, path.basename(file)); // Get only the filename

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${path.basename(file)} to ${abiDestDir}`);
      } else {
        console.warn(`Warning: Source ABI file not found: ${sourcePath}`);
      }
    }
    console.log("ABI copying complete.");
  } catch (error) {
    console.error("Error copying ABI files:", error);
  }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
