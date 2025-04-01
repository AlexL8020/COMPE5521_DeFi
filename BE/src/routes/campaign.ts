import { Router } from "express";
import {
  campaigndata,
  getCampaigns,
  getCampaignByID,
    // import other controllers as needed
  } from "../controllers/campaigndata";


const router = Router();
router.post("/", campaigndata);
router.get("/", getCampaigns);
router.get("/:id", getCampaignByID);

export default router;