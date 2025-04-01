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
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    title: {
        type: String,
        //required: [true, "title name is required"],
        trim: true,
    },
    category: {
        type: String,
        //required: [true, "category name is required"],
        trim: true,
    },
    shortDescription: {
        type: String,
        //required: [true, "shortDescription is required"],
        trim: true,
    },
    image: {
        type: Object,
        //required: [true, "image is required"],
        trim: true,
    },
    fullDescription: {
        type: String,
        //required: [true, "fullDescription is required"],
        trim: true,
    },
    timeline: {
        type: String,
        //required: [true, "timeline is required"],
        trim: true,
    },
    aboutYou: {
        type: String,
        //required: [true, "aboutYou is required"],
        trim: true,
    },
    fundingGoal: {
        type: String,
        //required: [true, "fundingGoal is required"],
        trim: true,
    },
    duration: {
        type: String,
        //required: [true, "duration is required"],
        trim: true,
    },
    creatorWallet: {
        type: String,
        //required: [true, "duration is required"],
        trim: true,
    },
}, {
    timestamps: true,
});
const CampaignCreateForm = mongoose_1.default.model("CampaignCreateForm", userSchema); // Collection: 'users'
exports.default = CampaignCreateForm;
