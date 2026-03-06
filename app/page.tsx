"use client";

import { useRouter } from "next/navigation";
import { Wind } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#1a0a1f] to-[#0f0a1a] text-white">
      <div className="text-center max-w-2xl px-6">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl">
            <Wind size={40} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">
          Air Quality Monitoring System
        </h1>

        {/* Description */}
        <p className="text-gray-300 mb-10 text-lg">
          A wearable IoT system that monitors air pollution levels in real time
          including PM2.5, CO2, temperature, and humidity using embedded sensors
          and a cloud-based dashboard.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 border border-purple-500 hover:bg-purple-500/20 rounded-lg"
          >
            View Dashboard
          </button>
        </div>

      </div>
    </main>
  );
}
