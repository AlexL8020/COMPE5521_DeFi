// src/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface representing a document in MongoDB.
export interface IUser extends Document {
  name: string;
  email: string;
  age?: number; // Optional field
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition corresponding to the IUser interface.
const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"], // Basic email format validation
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
    },
  },
  {
    // Add timestamps (createdAt, updatedAt) automatically
    timestamps: true,
  },
);

// Create and export the Mongoose model.
// The third argument 'users' explicitly sets the collection name.
// If omitted, Mongoose defaults to the plural, lowercased version of the model name ('User' -> 'users').
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema, "users");

export default User;
