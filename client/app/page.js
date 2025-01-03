"use client";

import { SignInButton, SignOutButton, SignedIn, SignedOut, useClerk, SignUpButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const { user } = useClerk();  
  const [mounted, setMounted] = useState(false); 
  const router = useRouter();  

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("Mounted:", mounted);
    console.log("Clerk user:", user);
  }, [mounted, user]);

  useEffect(() => {
    if (mounted && user) {
      console.log("User is signed in. Redirecting to /expenses...");
      setTimeout(() => {
        router.replace("/expenses");
      }, 100);
    }
  }, [user, mounted, router]);

  if (!mounted) return null;

  return (
    <>
      <div className="flex poppins justify-center items-center min-h-screen p-5">
        <div className="w-full max-w-md bg-white rounded-lg p-6 text-center">

          <SignedOut>
            {/* Title */}
            <h1 className="text-5xl font-bold mb-4">Expenza</h1>
            <div className="text-lg font-semibold mb-6">an app to manage all of your money.</div>
            
            {/* Stacked Buttons */}
            <div className="flex flex-col gap-4 items-center font-medium">
              <SignInButton className="bg-gray-800 border-gray-800 border-2 text-white px-4 py-2 rounded-lg hover:bg-white hover:border-2 hover:border-gray-800 hover:text-gray-800 transition-all duration-200 w-1/2">
                Sign Up
              </SignInButton>

              <SignUpButton className=" border-gray-800 border-2 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-200 w-1/2">
                Sign In
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
            <SignOutButton className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-all duration-200 w-1/2" />
          </SignedIn>
          
        </div>
      </div>
    </>
);

}
