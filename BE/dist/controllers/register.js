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
exports.register = void 0;
const register_1 = __importDefault(require("../models/register")); // Import model and interface
const register = (
// Use the specific request body type
req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Basic validation (Mongoose schema validation also applies)
        if (!name || !email) {
            res.status(400).json({ message: "Name and email are required" });
            return; // Important to return after sending response
        }
        const newUser = new register_1.default({ name, email, password });
        const savedUser = yield newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        // Handle potential duplicate key error (email unique)
        if (error instanceof Error && error.code === 11000) {
            res.status(409).json({ message: "Email already exists" }); // 409 Conflict
            return;
        }
        // Pass other errors to a generic error handler (if you have one)
        // For now, just log and send a 500
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
        // Or: next(error); // If using error handling middleware
    }
});
exports.register = register;
