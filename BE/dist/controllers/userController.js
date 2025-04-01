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
exports.getUserById = exports.getUsers = exports.createUser = void 0;
const User_1 = __importDefault(require("../models/User")); // Import model and interface
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = (
// Use the specific request body type
req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, age } = req.body;
        // Basic validation (Mongoose schema validation also applies)
        if (!name || !email) {
            res.status(400).json({ message: "Name and email are required" });
            return; // Important to return after sending response
        }
        const newUser = new User_1.default({ name, email, age });
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
exports.createUser = createUser;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({}); // Fetch all users
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
        // Or: next(error);
    }
});
exports.getUsers = getUsers;
const getUserById = (req, // Type the route parameter 'id'
res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: "Invalid user ID format" });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Failed to fetch user" });
        // Or: next(error);
    }
});
exports.getUserById = getUserById;
// Add other controller functions (updateUser, deleteUser) similarly...
