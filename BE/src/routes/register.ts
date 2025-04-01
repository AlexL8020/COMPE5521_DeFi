import { Router } from "express";
import {
    register,
    // import other controllers as needed
  } from "../controllers/register";


const router = Router();
router.post("/", register);


export default router;