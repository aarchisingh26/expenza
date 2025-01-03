import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import cors from 'cors';
import expenseRoutes from "./routes/expense.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 9000;

app.use(cors({
  origin: 'http://localhost:3000', //allow requests from localhost:3000
}));

app.use(express.json());

// Routes
app.use("/api/expenses", expenseRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server running on http://localhost:" + PORT);
});
