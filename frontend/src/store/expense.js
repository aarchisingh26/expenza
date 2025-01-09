import { create } from "zustand";

export const useExpenseTracker = create((set) => ({
	expenses: [],
	setExpenses: (expenses) => set({ expenses }),
	createExpense: async (newExpense) => {
		if (!newExpense.name || !newExpense.category || !newExpense.price) {
			return { success: false, message: "Please fill in all fields." };
		}
		const res = await fetch("http://localhost:2000/expenses", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newExpense),
		});
		const data = await res.json();
		set((state) => ({ expenses: [...state.expenses, data.data] }));
		return { success: true, message: "Expense created successfully" };
	},

	// fetchExpenses: async () => {
	// 	const res = await fetch("http://localhost:2000/api/expenses");
	// 	const data = await res.json();
	// 	set({ expenses: data.data });
	// },

    // fetchExpenses: async () => {
    //     try {
    //         const res = await fetch("http://localhost:2000/api/expenses");
    //         if (!res.ok) {
    //             throw new Error("Failed to fetch expenses");
    //         }
    //         const data = await res.json();
    
    //         // Sort expenses by date (newest first)
    //         const sortedExpenses = data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    //         set({ expenses: sortedExpenses });
    //     } catch (error) {
    //         console.error("Error fetching expenses:", error.message);
    //     }
    // },

    
	deleteExpense: async (id) => {
		const res = await fetch(`http://localhost:2000/api/expenses/${id}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		// update the ui immediately, without needing a refresh
		set((state) => ({ expenses: state.expenses.filter((expense) => expense._id !== id) }));
		return { success: true, message: data.message };
	},

	// updateProduct: async (pid, updatedProduct) => {
	// 	const res = await fetch(`/api/expenses/${pid}`, {
	// 		method: "PUT",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify(updatedProduct),
	// 	});
	// 	const data = await res.json();
	// 	if (!data.success) return { success: false, message: data.message };

	// 	// update the ui immediately, without needing a refresh
	// 	set((state) => ({
	// 		expenses: state.expenses.map((product) => (product._id === pid ? data.data : product)),
	// 	}));

	// 	return { success: true, message: data.message };
	// },
}));