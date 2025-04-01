import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegister extends Document {
  name: string;
  email?: string; // Make email optional if login is wallet-based
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IRegister> = new Schema(
  {
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
    password: {
        type: String,
        required: [true, "Password name is required"],
        trim: true,
      },
  },
  {
    timestamps: true,
  }
);

const Register: Model<IRegister> = mongoose.model<IRegister>("Register", userSchema); // Collection: 'users'

export default Register;