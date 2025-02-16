"use client";
import React, { useEffect } from "react";
import LoginForm from "./LoginForm";
import { useAuth } from "@/app/Utils/Context/AuthContext";
import { useRouter } from "next/navigation";
import LoaderComponent from "@/app/Components/Loader/LoaderComponent";

const LoginPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
        router.push("/DashBoard");
    }
  }, [user]);

  return <div>{!user ? <LoginForm /> : <LoaderComponent />}</div>;
};

export default LoginPage;
