"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaigndata_1 = require("../controllers/campaigndata");
const router = (0, express_1.Router)();
router.post("/", campaigndata_1.campaigndata);
exports.default = router;
