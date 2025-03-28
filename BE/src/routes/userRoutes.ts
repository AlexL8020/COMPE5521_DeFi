// src/routes/userRoutes.ts
import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  // import other controllers as needed
} from "../controllers/userController";

const router = Router();

// Define routes
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
// router.patch('/:id', updateUser); // Example for update
// router.delete('/:id', deleteUser); // Example for delete

export default router;
