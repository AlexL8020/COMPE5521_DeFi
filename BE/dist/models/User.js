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
// src/models/User.ts
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
    },
    email: {
        type: String,
        // required: false, // Only require if using email login too
        unique: true,
        sparse: true, // Allows multiple null/undefined emails but unique if present
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    profilePictureUrl: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    walletAddress: {
        // Indexed for potential lookups
        type: String,
        required: [true, "Wallet address is required"],
        unique: true, // Each user profile should map to one unique wallet
        trim: true,
        // Add validation for address format if desired (e.g., regex)
        // match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format']
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("User", userSchema); // Collection: 'users'
exports.default = User;
