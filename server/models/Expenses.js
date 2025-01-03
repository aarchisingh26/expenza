import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true, //createdAt, updatedAt
	}
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;