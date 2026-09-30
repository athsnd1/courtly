import express from "express";
import * as PaymentsController from "../controllers/payments.controller";

const router = express.Router();

router.post("/subscribe", PaymentsController.handleSubController);

router.post("/cancel", PaymentsController.cancelSubController);

router.get("/subscription", PaymentsController.getCurrentSubController);

export default router;