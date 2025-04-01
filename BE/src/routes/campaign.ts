import { Router } from "express";
import {
  campaigndata,
    // import other controllers as needed
  } from "../controllers/campaigndata";


const router = Router();
router.post("/", campaigndata);


export default router;