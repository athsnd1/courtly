import express from "express";
import * as PaymentsController from "../controllers/payments.controller";

const router = express.Router();

router.post("/subscribe", PaymentsController.handleSubController);

export default router;