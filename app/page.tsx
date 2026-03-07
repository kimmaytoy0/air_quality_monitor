"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">

        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Air Quality Monitor"
          width={150}
          height={150}
          className="mx-auto mb-6"
        />

        {/* Project Name */}
        <h1 className="text-3xl font-bold">
          AIR QUALITY MONITOR
        </h1>

      </div>
    </main>
  );
}