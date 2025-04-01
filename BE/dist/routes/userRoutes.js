"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// Define routes
router.post("/", userController_1.createUser);
router.get("/", userController_1.getUsers);
router.get("/:id", userController_1.getUserById);
// router.patch('/:id', updateUser); // Example for update
// router.delete('/:id', deleteUser); // Example for delete
exports.default = router;
