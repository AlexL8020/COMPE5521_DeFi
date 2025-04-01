"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/CampaignMetadata.ts
const mongoose_1 = __importStar(require("mongoose"));
const campaignMetadataSchema = new mongoose_1.Schema({
    contractAddress: {
        // Address of the corresponding Campaign contract on the blockchain
        type: String,
        required: true,
        unique: true, // Each metadata doc maps to one unique contract
        trim: true,
        // Add validation for address format if desired
        // match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address format']
    },
    creatorWalletAddress: {
        // Optional: Denormalize for querying, but ensure consistency
        type: String,
        required: true,
        trim: true,
    },
    creator: {
        // Link to the User document in the 'users' collection
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User", // Reference the 'User' model
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    imageUrl: { type: String, trim: true }, //4.Campaign Image
    videoUrl: { type: String, trim: true },
    category: { type: String, trim: true }, //2.Category
    updates: [
        {
            message: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],
}, {
    timestamps: true,
});
// Indexing for common queries
campaignMetadataSchema.index({ creator: 1 });
campaignMetadataSchema.index({ category: 1 });
campaignMetadataSchema.index({ title: "text", description: "text" }); // For text search
const CampaignMetadata = mongoose_1.default.model("CampaignMetadata", // Model name
campaignMetadataSchema, // Schema
"campaign_metadata" // Explicit collection name
);
exports.default = CampaignMetadata;
