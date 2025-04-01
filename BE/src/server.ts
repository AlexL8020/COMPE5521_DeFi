// src/server.ts
import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { connectDB, closeDB } from "./config/db";
import userRoutes from "./routes/userRoutes"; // Import the user routes
import register from "./routes/register";
import campaign from "./routes/campaign";
import cors from "cors";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB(); // Call connectDB which handles connection and errors

//const cors = require("cors");
const app: Express = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

const corsOptions ={
  origin:'*', 
  //credentials:true,            //access-control-allow-credentials:true
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionSuccessStatus:200,
  "Access-Control-Request-Headers": 'Content-Type',
  
}

//app.use(cors()) // Use this after the variable declaration
app.use(cors(corsOptions)) // Use this after the variable declaration

// --- Routes ---
// Basic root route
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running!");
});

// Mount User routes
app.use("/api/v1/users", userRoutes); // Use a base path like /api/v1
app.use("/api/v1/register", register);
app.use("/api/v1/campaign", campaign);

// --- Basic Error Handling Middleware (Example) ---
// Place after all routes
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err.stack); // Log the stack trace
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// --- 404 Handler ---
// Place after all routes and error handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// --- Server Startup ---
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// --- Graceful Shutdown ---
const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal} signal received: closing server gracefully.`);
    try {
      // Stop accepting new connections
      server.close(async (err) => {
        if (err) {
          console.error("Error closing HTTP server:", err);
          process.exit(1); // Exit with error code
        } else {
          console.log("HTTP server closed.");
          // Close DB connection
          await closeDB();
          console.log("Database connection closed.");
          process.exit(0); // Exit successfully
        }
      });
    } catch (err) {
      console.error("Error during graceful shutdown:", err);
      process.exit(1);
    }
  });
});
