import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { SignedIn, SignedOut, SignInButton, SignOutButton, useClerk, SignUpButton } from "@clerk/clerk-react";
import Expenses from './pages/Expenses';

export default function App() {
  const navigate = useNavigate(); // Hook to handle navigation
  const { user, isLoaded } = useClerk(); // Clerk hook to get user and loading state
  const [mounted, setMounted] = useState(false); // State to track if component has mounted

  // Handle mounted state
  useEffect(() => {
    setMounted(true); // Set mounted to true once component is mounted
  }, []);

  // Log for debugging
  useEffect(() => {
    console.log("Mounted:", mounted);
    console.log("Clerk user:", user);
  }, [mounted, user]);

  // Redirect if user is signed in and component is mounted
  useEffect(() => {
    if (mounted && user) {
      console.log("User is signed in. Redirecting to /expenses...");
      setTimeout(() => {
        navigate('/expenses'); // Use navigate from react-router-dom
      }, 100); // Delay to allow Clerk to fully load
    }
  }, [user, mounted, navigate]);

  // Prevent rendering before component is mounted
  if (!mounted) return null;

  return (

    <div className="flex poppins justify-center items-center min-h-screen p-5">
        <div className="w-full max-w-md bg-white rounded-lg p-6 text-center">
    
      <Routes>
        {/* Route for users who are not signed in */}
        <Route path="/" element={
          <SignedOut>
          <h1 className="text-5xl font-bold mb-4">Expenza</h1>
            <div className="text-lg font-semibold mb-6">an app to manage all of your money.</div>
            <div className="flex flex-col gap-4 items-center font-medium">
              <SignUpButton className="bg-gray-800 border-gray-800 border-2 text-white px-4 py-2 rounded-lg hover:bg-white hover:border-2 hover:border-gray-800 hover:text-gray-800 transition-all duration-200 w-1/2">
                Sign Up
              </SignUpButton>

              <SignInButton className=" border-gray-800 border-2 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 w-1/2">
                Sign In
              </SignInButton>
            </div>
          </SignedOut>
        } />

        {/* Route for signed-in users */}
        <Route path="/expenses" element={

          <SignedIn>
            <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
            <div>
              <SignOutButton />
              <Expenses />
            </div>
          </SignedIn>

        } />
      </Routes>
    
    </div>
  </div>
    
  );
}
