"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/app/Utils/Context/AuthContext";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/public/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456", // Replace with the actual API key
          },
          body: JSON.stringify({ email, password }),
        }
      );

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Invalid credentials");
      // }

      const data = await response.json();

      // Save user data
      login({
        email: data.restaurant.restaurant_email,
        id: data.restaurant._id,
        name: data.restaurant.restaurant_name,
        token: data.token,
        restaurant_details: data.restaurant,
      });

      // Redirect to dashboard
      router.push("/DashBoard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="py-36">
        <div className="flex justify-center bg-slate-100 border-t-2 rounded-lg drop-shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
          <div
            className="hidden lg:block lg:w-1/2 bg-cover"
            style={{
              backgroundImage:
                'url("https://i.postimg.cc/wvfsqFJ8/cartoon-pay-bill-s-box-with-credit-card-it-357500-4989.jpg")',
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <h2 className="text-2xl font-semibold text-zinc-700 text-center">
              Baksish
            </h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <label className="block text-zinc-700 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  className="bg-zinc-200 text-zinc-700 focus:outline-none focus:shadow-outline border border-zinc-300 rounded py-2 px-4 block w-full appearance-none"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <label className="block text-zinc-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
                  >
                    Forget Password?
                  </a>
                </div>
                <input
                  className="bg-zinc-200 text-zinc-700 focus:outline-none focus:shadow-outline border border-zinc-300 rounded py-2 px-4 block w-full appearance-none"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-8">
                <button
                  type="submit"
                  className="bg-zinc-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-zinc-900 transition-colors duration-100"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4" />
              <a
                href="#"
                className="text-xs text-zinc-500 hover:text-zinc-900 uppercase transition-colors duration-300"
              >
                or sign up
              </a>
              <span className="border-b w-1/5 md:w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
