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
        date: {
            type: Date,
            default: Date.now, //stores UTC by default
        },
    },
    {
        timestamps: true, // createdAt, updatedAt (stored in UTC)
    }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
