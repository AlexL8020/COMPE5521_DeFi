"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaigndata = void 0;
const CampaignCreateForm_1 = __importDefault(require("../models/CampaignCreateForm")); // Import model and interface
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const campaigndata = (
// Use the specific request body type
req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, category, shortDescription, image, fullDescription, timeline, aboutYou, fundingGoal, duration, creatorWallet } = req.body;
        console.log(req.body);
        // Basic validation (Mongoose schema validation also applies)
        const newCampaign = new CampaignCreateForm_1.default({ title, category, shortDescription,
            image, fullDescription, timeline,
            aboutYou, fundingGoal, duration, creatorWallet });
        const savedCampaign = yield newCampaign.save();
        res.status(201).json(savedCampaign);
    }
    catch (error) {
        // Handle potential duplicate key error (email unique)
        if (error instanceof Error && error.code === 11000) {
            res.status(400).json({ message: "Same Campaign title already exists" });
            return;
        }
        // Pass other errors to a generic error handler (if you have one)
        // For now, just log and send a 500
        console.error("Error creating Campaign:", error);
        res.status(500).json({ message: "Failed to create Campaign" });
        // Or: next(error); // If using error handling middleware
    }
});
exports.campaigndata = campaigndata;
