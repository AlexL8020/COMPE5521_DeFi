import { Request, Response, NextFunction } from "express";
import CampaignCreateForm, { ICampaignCreateForm } from "../models/CampaignCreateForm"; // Import model and interface
import mongoose, { Schema, Document, Model } from "mongoose";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());

interface CreateNewCampaignBody {
      title: string;
      category: string;
      shortDescription: string;
      image: Object;
      fullDescription: string;
      timeline: string;
      aboutYou: string;
      fundingGoal: string;
      duration: string;
      creatorWallet: string;

  }

  export const campaigndata = async (
    // Use the specific request body type
    req: Request<{}, {}, CreateNewCampaignBody>,
    res: Response,
    next: NextFunction, // Include next for error handling middleware
  ): Promise<void> => {
    try {
      const { title, category, shortDescription, 
        image,fullDescription,timeline,
        aboutYou, fundingGoal,duration,
        creatorWallet} = req.body;

        console.log(req.body)
  
      // Basic validation (Mongoose schema validation also applies)
    
      const newCampaign = new CampaignCreateForm({ title, category, shortDescription, 
        image,fullDescription,timeline,
        aboutYou, fundingGoal,duration,creatorWallet });
      const savedCampaign = await newCampaign.save();
  
      res.status(201).json(savedCampaign);
    } catch (error) {
      // Handle potential duplicate key error (email unique)
      if (error instanceof Error && (error as any).code === 11000) {
        res.status(400).json({ message: "Same Campaign title already exists" }); 
        return;
      }
      // Pass other errors to a generic error handler (if you have one)
      // For now, just log and send a 500
      console.error("Error creating Campaign:", error);
      res.status(500).json({ message: "Failed to create Campaign" });
      // Or: next(error); // If using error handling middleware
    }
  };