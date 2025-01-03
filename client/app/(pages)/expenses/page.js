"use client";

import { useExpenses } from "@/store/expense";
import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { IoMdArrowDroprightCircle } from "react-icons/io";

export default function Expenses() {
  const [newExpense, setNewExpense] = useState({
    name: "",
    price: "",
    category: "",
  });

  const { createExpense, fetchExpenses, expenses } = useExpenses();

  // Get the local date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(() => {
    if (typeof window !== "undefined") {
      const savedDate = localStorage.getItem("selectedDate");
      if (savedDate) return savedDate;
    }

    const today = new Date();
    // Set the date to midnight in local time to avoid timezone issues
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split("T")[0]; // Return in YYYY-MM-DD format
  });

  useEffect(() => {
    fetchExpenses(selectedDate);
  }, [fetchExpenses, selectedDate]);

  const handleAddExpense = async (e) => {
    e.preventDefault();

    const expenseWithDate = {
      ...newExpense,
      date: selectedDate,
    };

    const { success, message } = await createExpense(expenseWithDate);
    if (success) {
      setNewExpense({ name: "", price: "", category: "" });
      fetchExpenses(selectedDate);
    } else {
      console.error(message);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    localStorage.setItem("selectedDate", newDate);
  };

  const handlePreviousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    prevDate.setHours(0, 0, 0, 0); // Ensure midnight hour to avoid timezone issues
    const formattedDate = prevDate.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    localStorage.setItem("selectedDate", formattedDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate.setHours(0, 0, 0, 0); // Ensure midnight hour to avoid timezone issues
    const formattedDate = nextDate.toISOString().split("T")[0];
    setSelectedDate(formattedDate);
    localStorage.setItem("selectedDate", formattedDate);
  };

  return (
    <div className="flex poppins justify-center items-center min-h-screen p-5">
      <div className="w-full max-w-md bg-white rounded-lg p-6">
        <SignedIn>
          <SignOutButton className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200">
            Sign Out
          </SignOutButton>

          <h1 className="text-2xl mt-10 font-bold text-center mb-4">
            Welcome to your Expenza Tracker
          </h1>

            <div className="flex items-center justify-between mt-5">
            <button
                type="button"
                onClick={handlePreviousDay}
                className="px-3 py-1"
            >
                <IoMdArrowDropleftCircle className="text-3xl" />
            </button>

            {/* Display the formatted date between the arrows */}
            <span className="text-xl font-semibold mt-2">
                {format(new Date(selectedDate + 'T00:00:00'), 'MMM d, yyyy')}
            </span>

            <button
                type="button"
                onClick={handleNextDay}
                className="px-3 py-1"
            >
                <IoMdArrowDroprightCircle className="text-3xl" />
            </button>
            </div>

          {/* Form to add a new expense */}
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mt-5">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newExpense.name}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium">
                Price:
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={newExpense.price}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, price: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium">
                Category:
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-900"
            >
              Add Expense
            </button>
          </form>


        
        <h2 className="text-xl font-semibold mt-6 text-center">
            Expenses for {format(new Date(selectedDate + 'T00:00:00'), 'MMM d, yyyy')}
        </h2>

          
        <ul className="mt-4 space-y-2">
            {expenses.map((expense) => (
                <li 
                key={expense._id} 
                className="p-3 border-b flex justify-between items-center"
                >

                <div>
                    <span className="uppercase">[{expense.category}]</span>{' '}
                    <span className="font-semibold">{expense.name}</span>
                </div>

                
                <span className="font-semibold">${expense.price}</span>
                </li>
            ))}
        </ul>


          
          <div className="mt-6 text-center text-lg font-semibold">
            Total Spent: $
            {expenses
              .reduce((total, expense) => total + Number(expense.price), 0)
              .toFixed(2)}
          </div>


        </SignedIn>
      </div>
    </div>
  );
}
