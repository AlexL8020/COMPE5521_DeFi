import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaignCreateForm extends Document {
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
    progress: string;
    
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema<ICampaignCreateForm> = new Schema(
  {
    title: {
      type: String,
      required: [true, "title name is required"],
      trim: true,
    },

    category: {
        type: String,
        required: [true, "category name is required"],
        trim: true,
      },

    shortDescription: {
        type: String,
        required: [true, "shortDescription is required"],
        trim: true,
      },

    image: {
        type: Object,
        required: [true, "image is required"],
        trim: true,
      },
  
    fullDescription: {
        type: String,
        required: [true, "fullDescription is required"],
        trim: true,
        },
  
    timeline: {
        type: String,
        required: [true, "timeline is required"],
        trim: true,
        },

    aboutYou: {
        type: String,
        required: [true, "aboutYou is required"],
        trim: true,
        },
      
    fundingGoal: {
        type: String,
        required: [true, "fundingGoal is required"],
        trim: true,
    },
      
    duration: {
        type: String,
        required: [true, "duration is required"],
        trim: true,
    },
    creatorWallet: {
        type: String,
        required: [true, "Connection to wallet is required"],
        trim: true,
    },
    progress: {
      type: String,
      default:'0',
      trim: true,
  },

    
    
  },
  {
    timestamps: true,
  }
);

const CampaignCreateForm: Model<ICampaignCreateForm> = mongoose.model<ICampaignCreateForm>("CampaignCreateForm", userSchema); // Collection: 'users'

export default CampaignCreateForm;