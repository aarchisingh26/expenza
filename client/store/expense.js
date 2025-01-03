import { create } from "zustand";

export const useExpenses = create((set) => ({
    expenses: [],
    setExpenses: (expenses) => set({ expenses }),

    createExpense: async (newExpense) => {
        if (!newExpense.name || !newExpense.price || !newExpense.category) {
            return { success: false, message: "Please fill in all fields." };
        }
        try {
            const res = await fetch("http://localhost:9000/api/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newExpense),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            set((state) => ({ expenses: [...state.expenses, data.data] }));
            return { success: true, message: "Expense created successfully" };
        } catch (error) {
            console.error("Error creating expense:", error);
            return { success: false, message: error.message };
        }
    },

    fetchExpenses: async (date) => {
        try {
            const res = await fetch(`http://localhost:9000/api/expenses?date=${date}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            set({ expenses: data.data });
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    },

    deleteExpense: async (pid) => {
        try {
            const res = await fetch(`http://localhost:9000/api/expenses/${pid}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Update the state immediately after deletion
            set((state) => ({
                expenses: state.expenses.filter((expense) => expense._id !== pid),
            }));
            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error deleting expense:", error);
            return { success: false, message: error.message };
        }
    },

    updateExpense: async (pid, updatedExpense) => {
        try {
            const res = await fetch(`http://localhost:9000/api/expenses/${pid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedExpense),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Update the state immediately after the update
            set((state) => ({
                expenses: state.expenses.map((expense) =>
                    expense._id === pid ? data.data : expense
                ),
            }));
            return { success: true, message: data.message };
        } catch (error) {
            console.error("Error updating expense:", error);
            return { success: false, message: error.message };
        }
    },
}));
