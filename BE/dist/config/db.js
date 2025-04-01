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
exports.closeDB = exports.connectDB = void 0;
// src/config/db.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load .env file variables (primarily for non-Docker runs)
// Read variables passed by Docker Compose environment
//const mongoUri_base = process.env.MONGODB_URI; // Reads base URI e.g., mongodb://user:pass@mongo:27017
const mongoUri_base = "mongodb://localhost:27017/DeFi";
//const dbName = process.env.MONGODB_DB_NAME;
const dbName = "DeFi";
if (!mongoUri_base) {
    console.error("FATAL ERROR: MONGODB_URI environment variable is not defined.");
    process.exit(1);
}
// Construct the full URI: Append DB name and explicitly add authSource=admin
// Ensure base URI doesn't already contain query params before appending
const baseUri = mongoUri_base.split("?")[0];
const dbPart = dbName ? `/${dbName}` : "";
// Define standard options, including authSource
const optionsPart = "?authSource=admin&retryWrites=true&w=majority";
//const fullUri = `${baseUri}${dbPart}${optionsPart}`;
const fullUri = "mongodb://localhost:27017/DeFi";
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uriToLog = mongoUri_base.replace(/\/\/([^:]+):([^@]+)@/, "//<username>:<password>@");
        console.log(`Base URI from env: ${uriToLog}`);
        console.log(`Attempting to connect with full URI: ${fullUri.replace(/\/\/([^:]+):([^@]+)@/, "//<username>:<password>@")}`); // Log full URI safely
        if (dbName) {
            console.log(`Target Database name: ${dbName}`);
        }
        yield mongoose_1.default.connect(fullUri); // Use the explicitly constructed URI
        console.log("MongoDB connected successfully using Mongoose!");
        mongoose_1.default.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            console.log("Mongoose disconnected.");
        });
    }
    catch (err) {
        console.error(`Failed to connect to MongoDB: ${err}`);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
const closeDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connection.close();
        console.log("Mongoose connection closed.");
    }
    catch (err) {
        console.error("Error closing Mongoose connection:", err);
    }
});
exports.closeDB = closeDB;
