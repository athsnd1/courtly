import express from "express";
import { getLawyersController } from "../controllers/lawyers.controller";

const router = express.Router();

router.get("/lawyers", getLawyersController)

export default router;