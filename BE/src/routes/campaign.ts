import { Router } from "express";
import {
  campaigndata,
  getCampaigns,
  getCampaignByID,
  updateCampaignProgress,
    // import other controllers as needed
  } from "../controllers/campaigndata";


const router = Router();
router.post("/", campaigndata);
router.get("/", getCampaigns);
router.get("/:id", getCampaignByID);
router.patch("/:id", updateCampaignProgress);


export default router;