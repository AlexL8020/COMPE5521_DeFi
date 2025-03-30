// src/config/seedData.ts

// --- Generate Placeholder Addresses (Replace with real ones if seeding from deployed contracts) ---
const placeholderWallets = [
  "0x1111111111111111111111111111111111111111", // Alice's Wallet
  "0x2222222222222222222222222222222222222222", // Bob's Wallet
  "0x3333333333333333333333333333333333333333", // Charlie's Wallet (Backer)
];

const placeholderContracts = [
  "0xAAAAAAAAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", // Alice's Campaign Contract
  "0xBBBBBBBBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", // Bob's Campaign Contract
];
// --- End Placeholder Addresses ---

export const demoUsersSeed = [
  {
    name: "Alice CryptoDev",
    email: "alice@seed.com",
    walletAddress: placeholderWallets[0],
    bio: "Student developing cool DApps!",
  },
  {
    name: "Bob Blockchain",
    email: "bob@seed.com",
    walletAddress: placeholderWallets[1],
    bio: "Learning Solidity and crowdfunding my project.",
  },
  {
    name: "Charlie Contributor",
    // email: null, // Example of wallet-only user
    walletAddress: placeholderWallets[2],
    bio: "Supporting student projects.",
  },
];

// Note: We need user IDs after they are created to link campaigns.
// Seeding script will handle this.
export const demoCampaignsSeed = [
  {
    // Corresponds to Alice
    contractAddress: placeholderContracts[0],
    creatorWalletAddress: placeholderWallets[0], // Link via wallet address
    title: "Decentralized Note Taking App",
    description:
      "Building a note-taking app where notes are stored decentrally using IPFS/Filecoin. Need funds for development tools and infrastructure.",
    category: "Technology",
    imageUrl: "https://via.placeholder.com/300x200.png?text=DApp+Notes",
  },
  {
    // Corresponds to Bob
    contractAddress: placeholderContracts[1],
    creatorWalletAddress: placeholderWallets[1], // Link via wallet address
    title: "NFT Art Project for Charity",
    description:
      "Creating a series of generative art NFTs. A portion of the proceeds will go to environmental charities. Funding needed for generative algorithm development and minting costs.",
    category: "Art & Charity",
    imageUrl: "https://via.placeholder.com/300x200.png?text=NFT+Art+Charity",
  },
];
