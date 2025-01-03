import express from "express";

import { createExpense, deleteExpense, getExpenses, updateExpense } from "../controllers/expense.controller.js"

const router = express.Router();

router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;