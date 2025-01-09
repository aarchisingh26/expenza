"use client";
import React, { useState, useEffect } from 'react';
import { useExpenseTracker } from '../store/expense';

export default function Expenses() {
    const [newExpense, setNewExpense] = useState({
        name: "",
        price: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
    });

    const [selectedDate, setSelectedDate] = useState(() => {
        const savedDate = localStorage.getItem("selectedDate");
        return savedDate ? new Date(savedDate) : new Date();
    });
    
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);

    const { createExpense, deleteExpense } = useExpenseTracker();

    
    const fetchExpenses = async () => {
        try {
            const res = await fetch("http://localhost:2000/api/expenses");
            const data = await res.json();
            if (res.ok) {
                setExpenses(data.data);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };
   
    useEffect(() => {
        fetchExpenses();
    }, []);

    
    useEffect(() => {
        localStorage.setItem("selectedDate", selectedDate.toISOString());
        const filtered = expenses.filter(expense =>
            new Date(expense.date).toDateString() === selectedDate.toDateString()
        );
        setFilteredExpenses(filtered);

        
        const total = filtered.reduce((sum, expense) => sum + expense.price, 0);
        setTotalSpent(total);
    }, [selectedDate, expenses]);

    

    useEffect(() => {
        localStorage.setItem("selectedDate", selectedDate.toISOString());
    
        // Compare only the date part (ignoring the time)
        const filtered = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            const selectedDateWithoutTime = new Date(selectedDate).setHours(0, 0, 0, 0);
            const expenseDateWithoutTime = expenseDate.setHours(0, 0, 0, 0);
            return expenseDateWithoutTime === selectedDateWithoutTime;
        });
        setFilteredExpenses(filtered);
    
        const total = filtered.reduce((sum, expense) => sum + expense.price, 0);
        setTotalSpent(total);
    }, [selectedDate, expenses]);
    
    
    const handleAddExpense = async () => {
        console.log("Adding expense for date:", selectedDate);
    
        const expenseToSave = {
            ...newExpense,
            date: selectedDate,
        };
    
        const { success, message } = await createExpense(expenseToSave);
        if (success) {
            await fetchExpenses();
            setNewExpense({ name: "", price: "", category: "", date: expenseToSave.date });
        } else {
            alert(message);
        }
    };
    
    const handlePreviousDay = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setSelectedDate(prevDate);
        console.log("Selected previous date:", prevDate);
    };
    
    const handleNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
        console.log("Selected next date:", nextDate);
    };
    
    const handleToday = () => {
        setSelectedDate(new Date());
    };


    const handleDeleteExpense = async (id) => {
        const { success, message } = await deleteExpense(id);
        if (success) {
            await fetchExpenses(); // Update the expenses list immediately
        } else {
            alert(message);
        }
    };
    


    return (
        <div className="flex poppins justify-center items-center min-h-screen p-5">
            {/* <h1 className="text-xl font-bold mb-5">Expense Tracker</h1> */}

            {/* <div className="flex items-center justify-center gap-4 my-4">
                <button onClick={handlePreviousDay} className="p-2 bg-gray-300 rounded">← Previous Day</button>
                <h2 className="text-lg font-bold">{selectedDate.toDateString()}</h2>
                <button onClick={handleNextDay} className="p-2 bg-gray-300 rounded">Next Day →</button>
                <button onClick={handleToday} className="p-2 bg-pink-500 text-white rounded">Today</button>
            </div> */}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button 
                    onClick={handlePreviousDay} 
                    style={{ backgroundColor: '#1f2937', display: 'flex', color: 'white'}}
                >
                    ←
                </button>
                
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedDate.toDateString()}</h2>
                
                <button 
                    onClick={handleNextDay} 
                    style={{ backgroundColor: '#1f2937', display: 'flex', color: 'white' }}
                >
                   →
                </button>
                
                <button 
                    onClick={handleToday} 
                    style={{ backgroundColor: '#e5e7eb', display: 'flex' }}
                >
                    Today
                </button>
            </div>


            {/* Add Expense Form */}
            <div className="poppins">
                <input
                    type="text"
                    placeholder="Name"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    style={{
                        marginBottom: '12px'
                    }}
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={newExpense.price}
                    onChange={(e) => setNewExpense({ ...newExpense, price: parseFloat(e.target.value) || "" })}
                    className="w-full p-2 border rounded mb-2"
                    style={{
                        marginBottom: '12px'
                    }}
                />

                <input
                    type="text"
                    placeholder="Category"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full p-2 border rounded mb-2"
                    style={{
                        marginBottom: '12px'
                    }}
                />

                <button
                    style={{
                        backgroundColor: '#e5e7eb',
                        padding: '12px',
                        borderRadius: '8px',
                        width: 'auto',
                        cursor: 'pointer',
                        marginTop: '12px',
                    }}
                    onClick={handleAddExpense}
                >
                    Add Expense
                </button>
            </div>

            {/* Displaying Expenses for Selected Day */}
            <h2 className="text-lg font-semibold mt-8">Expenses on {selectedDate.toDateString()}</h2>
            <p style={{ fontWeight: 'bold'}}>Total Spent: ${totalSpent.toFixed(2)}</p>
            
            {filteredExpenses.length > 0 ? (
                <ul style={{ marginTop: '16px', padding: '0', listStyleType: 'none' }}>
                {filteredExpenses.map((expense, index) => (
                    <li key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'white'
                    }}>
                        {/* Category and Name */}
                        <div>
                            <span style={{
                                textTransform: 'uppercase',
                                fontSize: '0.875rem',
                                color: '#4B5563'
                            }}>{expense.category}</span>{' '}
                            <span style={{
                                fontWeight: '600',
                                fontSize: '1.125rem',
                            }}>{expense.name}</span>
                        </div>

                        {/* Price and Delete Button */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <span style={{
                                fontWeight: '600',
                                fontSize: '1.125rem',
                            }}>${expense.price.toFixed(2)}</span>
                            <button
                                onClick={() => handleDeleteExpense(expense._id)}
                                style={{
                                    backgroundColor: '#EF4444',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#DC2626'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#EF4444'}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            ) : (
                <p className="mt-4 text-gray-500">No expenses for this day.</p>
            )}
        </div>
    );
}

