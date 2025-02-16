"use client"
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function WeAreCooking() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen  text-white text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900 p-10 rounded-2xl shadow-xl text--white max-w-md"
      >
        <h1 className="text-3xl font-bold">We Are Cooking{dots}</h1>
        <p className="mt-4 text-lg">Something delicious is on its way! Stay tuned.</p>
        <div className="flex justify-center mt-6">
          <Loader className="animate-spin" size={32} />
        </div>
      </motion.div>
    </div>
  );
}
