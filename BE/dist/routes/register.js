"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_1 = require("../controllers/register");
const router = (0, express_1.Router)();
router.post("/", register_1.register);
exports.default = router;
