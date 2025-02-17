"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/app/Utils/Context/AuthContext"; // Adjust the path as per your folder structure
import { useRouter } from "next/navigation";
import DashBoardPage from "./Components/Home/Home";

const DashBoardpage: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirect to the login page if not logged in
    }
  }, [user, router]);

  const handleLogout = () => {
    logout(); // Clear user session
    router.push("/"); // Redirect to the login page
  };

  if (!user) {
    return <p>Redirecting...</p>;
  }

  return (
    <div>
      <div className="mt-4 px-4 ml-4 text-3xl font-medium text-gray-800">
          Dashboard
      </div>
      {/* <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
      <p className="mb-2">
        Logged in as: <strong>{user.email}</strong>
      </p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      >
        Logout
      </button> */}
      {/* <h1 className="text-2xl">DashBoard</h1> */}
      <DashBoardPage />
    </div>
  );
};

export default DashBoardpage;
