// src/server.ts
import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { connectDB, closeDB } from "./config/db";
import userRoutesV2 from "./routes/userRoutesV2";
import register from "./routes/register";
import campaign from "./routes/campaign";
import blockchainRoutes from "./routes/blockchainRoutes"; // Import blockchain routes
import cors from "cors";
import bodyParser from "body-parser";
// Import blockchainService if needed by other parts (though not for listeners)
// import { blockchainService } from "./services/blockchainService";
// Import CampaignMetadata if needed by other parts (though not for listeners)
// import CampaignMetadata from "./models/CampaignMetadata";

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionSuccessStatus: 200,
  "Access-Control-Request-Headers": "Content-Type",
};

app.use(cors(corsOptions));
// app.use(bodyParser.json({ limit: "1500kb" }));

// app.use((req, res, next) => {
//   if (req.headers["content-type"] === "application/json") {
//     bodyParser.json()(req, res, next);
//   } else {
//     next(); // Skip JSON parsing for other content types
//   }
// });

app.use(express.json({ limit: "10mb" }));

// If you might also use URL-encoded forms with large data (less likely for base64)
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is running!");
});

// Mount routes
// app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", userRoutesV2);
app.use("/api/v1/register", register);
app.use("/api/v1/campaign", campaign);
app.use("/api/v1/blockchain", blockchainRoutes); // Add blockchain routes

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint Not Found" });
});

// Server Startup
const server = app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);

  // Connect to database
  await connectDB();

  // --- Removed Event Listener Setup ---
  // The following block has been removed as setupEventListeners no longer exists
  /*
  blockchainService.setupEventListeners(async (event) => {
    console.log("Blockchain event:", event);

    // Handle different event types
    if (event.type === "ContributionMade") {
      // ... (event handling logic removed) ...
    }
  });
  */
  // --- End of Removed Block ---

  console.log("Server setup complete."); // Added confirmation log
});

// Graceful Shutdown
const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal} signal received: closing server gracefully.`);
    try {
      // Stop accepting new connections
      server.close(async (err) => {
        if (err) {
          console.error("Error closing HTTP server:", err);
          process.exit(1);
        } else {
          console.log("HTTP server closed.");
          // Close DB connection
          await closeDB();
          console.log("Database connection closed.");
          process.exit(0);
        }
      });
    } catch (err) {
      console.error("Error during graceful shutdown:", err);
      process.exit(1);
    }
  });
});
