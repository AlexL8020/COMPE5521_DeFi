import { Request, Response, NextFunction } from "express";
import Register, { IRegister } from "../models/register"; // Import model and interface
import mongoose, { Schema, Document, Model } from "mongoose";

interface CreateRegisterRequestBody {
    name: string;
    email: string;
    password: string;
  }

  export const register = async (
    // Use the specific request body type
    req: Request<{}, {}, CreateRegisterRequestBody>,
    res: Response,
    next: NextFunction, // Include next for error handling middleware
  ): Promise<void> => {
    try {
      const { name, email, password } = req.body;
  
      // Basic validation (Mongoose schema validation also applies)
      if (!name || !email) {
        res.status(400).json({ message: "Name and email are required" });
        return; // Important to return after sending response
      }
  
      const newUser = new Register({ name, email, password });
      const savedUser = await newUser.save();
  
      res.status(201).json(savedUser);
    } catch (error) {
      // Handle potential duplicate key error (email unique)
      if (error instanceof Error && (error as any).code === 11000) {
        res.status(409).json({ message: "Email already exists" }); // 409 Conflict
        return;
      }
      // Pass other errors to a generic error handler (if you have one)
      // For now, just log and send a 500
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
      // Or: next(error); // If using error handling middleware
    }
  };