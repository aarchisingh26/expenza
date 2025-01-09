import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './db.js';
import Expense from './expense.js';
import cors from "cors";
import mongoose from 'mongoose';
import path from "path";

dotenv.config();

const app = express();

// Enable CORS for all origins (for development only)
// app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:2000', // Replace with your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));

// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));


// Or specify the allowed origin
// app.use(cors({ origin: "http://localhost:5173" }));

const PORT = process.env.PORT || 2000;

const __dirname = path.resolve();

app.use(express.json());


app.get('/api/expenses', async (req, res) => {
    try {
		const expenses = await Expense.find({});
		res.status(200).json({ success: true, data: expenses });
	} catch (error) {
		console.log("error in fetching expenses:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
});

app.post('/expenses', async (req, res) => {
    const expense = req.body; //user will send this data

	if (!expense.name || !expense.price || !expense.category) {
		return res.status(400).json({ success: false, message: "Please provide all fields" });
	}

	const newExpense = new Expense(expense);

	try {
		await newExpense.save();
		res.status(201).json({ success: true, data: newExpense });
	} catch (error) {
		console.error("Error in Create expense:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
});

app.put('/api/expenses/:id', async (req, res) => {
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
});

app.delete('/api/expenses/:id', async (req, res) => {
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
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server running on http://localhost:" + PORT);
});

