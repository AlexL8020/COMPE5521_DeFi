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
// src/server.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // Import the user routes
const register_1 = __importDefault(require("./routes/register"));
const campaign_1 = __importDefault(require("./routes/campaign"));
const cors_1 = __importDefault(require("cors"));
// Load environment variables
dotenv_1.default.config();
// Connect to Database
(0, db_1.connectDB)(); // Call connectDB which handles connection and errors
//const cors = require("cors");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// --- Middleware ---
// Parse JSON bodies
app.use(express_1.default.json());
// Parse URL-encoded bodies
app.use(express_1.default.urlencoded({ extended: true }));
const corsOptions = {
    origin: '*',
    //credentials:true,            //access-control-allow-credentials:true
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionSuccessStatus: 200,
    "Access-Control-Request-Headers": 'Content-Type',
};
//app.use(cors()) // Use this after the variable declaration
app.use((0, cors_1.default)(corsOptions)); // Use this after the variable declaration
// --- Routes ---
// Basic root route
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server is running!");
});
// Mount User routes
app.use("/api/v1/users", userRoutes_1.default); // Use a base path like /api/v1
app.use("/api/v1/register", register_1.default);
app.use("/api/v1/campaign", campaign_1.default);
// --- Basic Error Handling Middleware (Example) ---
// Place after all routes
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack); // Log the stack trace
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});
// --- 404 Handler ---
// Place after all routes and error handler
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});
// --- Server Startup ---
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
// --- Graceful Shutdown ---
const signals = ["SIGINT", "SIGTERM"];
signals.forEach((signal) => {
    process.on(signal, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`\n${signal} signal received: closing server gracefully.`);
        try {
            // Stop accepting new connections
            server.close((err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.error("Error closing HTTP server:", err);
                    process.exit(1); // Exit with error code
                }
                else {
                    console.log("HTTP server closed.");
                    // Close DB connection
                    yield (0, db_1.closeDB)();
                    console.log("Database connection closed.");
                    process.exit(0); // Exit successfully
                }
            }));
        }
        catch (err) {
            console.error("Error during graceful shutdown:", err);
            process.exit(1);
        }
    }));
});
