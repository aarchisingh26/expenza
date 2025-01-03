import mongoose from "mongoose";
import Expense from "../models/Expenses.js";


export const getExpenses = async (req, res) => {
	try {
	  const { date } = req.query;
  
	  // Parse and match exact local date
	  const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
	  const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));
  
	  const expenses = await Expense.find({
		createdAt: { $gte: startOfDay, $lte: endOfDay },
	  });
  
	  res.status(200).json({ success: true, data: expenses });
	} catch (error) {
	  console.error("Error fetching expenses:", error.message);
	  res.status(500).json({ success: false, message: "Server Error" });
	}
  };

export const createExpense = async (req, res) => {
	try {
	  const { name, price, category, date } = req.body;
  
	  
	  const localDate = new Date(new Date(date).setHours(0, 0, 0, 0));
  
	  const newExpense = new Expense({
		name,
		price,
		category,
		createdAt: localDate,
	  });
  
	  await newExpense.save();
	  res.status(201).json({ success: true, data: newExpense });
	} catch (error) {
	  console.error("Error creating expense:", error.message);
	  res.status(500).json({ success: false, message: "Server Error" });
	}
  };
  

export const updateExpense = async (req, res) => {
    const { id } = req.params;

	const expense = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Expense Id" });
	}

	try {
		const updatedExpense = await Expense.findByIdAndUpdate(id, expense, { new: true });
		res.status(200).json({ success: true, data: updatedExpense });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteExpense = async (req, res) => {
    const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Expense Id" });
	}

	try {
		await Expense.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Expense deleted" });
	} catch (error) {
		console.log("error in deleting expense:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
