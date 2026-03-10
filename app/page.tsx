"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      className="flex items-center justify-center min-h-screen bg-black text-white overflow-hidden relative"
    >
      <style>{`
        @keyframes windStreak {
          0%   { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateX(130vw) skewX(-12deg); opacity: 0; }
        }
        @keyframes windStreakFast {
          0%   { transform: translateX(-120%) skewX(-8deg); opacity: 0; }
          8%   { opacity: 0.8; }
          92%  { opacity: 0.3; }
          100% { transform: translateX(130vw) skewX(-8deg); opacity: 0; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0px) rotate(0deg); opacity: 0; }
          20%  { opacity: 0.6; }
          80%  { opacity: 0.4; }
          100% { transform: translateY(-80px) rotate(15deg); opacity: 0; }
        }
        @keyframes logoReveal {
          0%   { opacity: 0; filter: blur(20px); transform: scale(0.8); }
          60%  { filter: blur(2px); }
          100% { opacity: 1; filter: blur(0px); transform: scale(1); }
        }
        @keyframes svgReveal {
          0%   { opacity: 0; transform: translateY(10px) scale(0.95); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0px) scale(1);    filter: blur(0px); }
        }
        @keyframes subtitleFade {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 0.5; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0px 0px rgba(130,200,255,0.0); }
          50%       { box-shadow: 0 0 40px 8px rgba(130,200,255,0.18); }
        }
        @keyframes progressBar {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
        .wind-streak {
          position: absolute;
          height: 1.5px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(160,220,255,0.55), transparent);
          animation: windStreak linear infinite;
          will-change: transform;
        }
        .wind-streak-fast {
          position: absolute;
          height: 1px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(200,235,255,0.4), transparent);
          animation: windStreakFast linear infinite;
          will-change: transform;
        }
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(160,220,255,0.5);
          animation: floatUp ease-in-out infinite;
        }
        .logo-wrap    { animation: logoReveal 1.1s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .svg-logo     { animation: svgReveal  0.9s cubic-bezier(0.22,1,0.36,1) 1.0s both; }
        .sub-label    { animation: subtitleFade 0.8s ease 1.6s both; }
        .glow-ring    { animation: pulseGlow 2.8s ease-in-out 1.4s infinite; }
        .progress     { animation: progressBar 3s linear forwards; }
      `}</style>

      {/* Background atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(30,80,130,0.35) 0%, transparent 70%), " +
            "radial-gradient(ellipse 100% 60% at 20% 50%, rgba(10,50,90,0.2) 0%, transparent 60%)",
        }}
      />

      {/* Wind streaks — slow */}
      {[
        { top: "12%", width: "38%", dur: "3.4s", delay: "0s"   },
        { top: "27%", width: "55%", dur: "2.8s", delay: "0.6s" },
        { top: "43%", width: "45%", dur: "3.9s", delay: "1.1s" },
        { top: "58%", width: "60%", dur: "2.6s", delay: "0.3s" },
        { top: "72%", width: "40%", dur: "3.2s", delay: "1.5s" },
        { top: "85%", width: "50%", dur: "2.9s", delay: "0.8s" },
      ].map((s, i) => (
        <div key={`streak-${i}`} className="wind-streak"
          style={{ top: s.top, width: s.width, animationDuration: s.dur, animationDelay: s.delay }} />
      ))}

      {/* Wind streaks — fast */}
      {[
        { top: "20%", width: "25%", dur: "1.8s", delay: "0.2s" },
        { top: "35%", width: "18%", dur: "2.1s", delay: "0.9s" },
        { top: "50%", width: "30%", dur: "1.6s", delay: "0.4s" },
        { top: "65%", width: "22%", dur: "2.3s", delay: "1.2s" },
        { top: "78%", width: "28%", dur: "1.9s", delay: "0.7s" },
      ].map((s, i) => (
        <div key={`fast-${i}`} className="wind-streak-fast"
          style={{ top: s.top, width: s.width, animationDuration: s.dur, animationDelay: s.delay }} />
      ))}

      {/* Floating dust particles */}
      {[
        { left: "15%", top: "70%", dur: "4.2s", delay: "0s"   },
        { left: "30%", top: "65%", dur: "3.8s", delay: "0.8s" },
        { left: "55%", top: "75%", dur: "5.0s", delay: "1.4s" },
        { left: "70%", top: "68%", dur: "3.5s", delay: "0.3s" },
        { left: "85%", top: "72%", dur: "4.6s", delay: "1.0s" },
        { left: "42%", top: "80%", dur: "4.0s", delay: "0.5s" },
      ].map((p, i) => (
        <div key={`part-${i}`} className="particle"
          style={{ left: p.left, top: p.top, animationDuration: p.dur, animationDelay: p.delay }} />
      ))}

      {/* Centre card */}
      <div className="relative z-10 flex flex-col items-center gap-6">

        {/* Pulse glow ring behind logo */}
        <div
          className="glow-ring absolute rounded-full pointer-events-none"
          style={{ width: 180, height: 180, top: "50%", left: "50%", transform: "translate(-50%,-50%) translateY(-30px)" }}
        />
        
        {/* LOGO_AIR SVG */}
        <div className="svg-logo">
          <Image
            src="/LOGO_AIR.svg"
            alt="LOGO_AIR"
            width={220}
            height={60}
            className="mx-auto drop-shadow-[0_0_16px_rgba(130,200,255,0.45)]"
          />
        </div>

        {/* Subtitle */}
        <p className="sub-label -mt-3 text-xs tracking-[0.35em] uppercase text-blue-200">
          Air Quality Monitor
        </p>

        {/* Progress bar */}
        <div
          className="mt-2 rounded-full overflow-hidden"
          style={{ width: 160, height: 2, background: "rgba(255,255,255,0.1)" }}
        >
          <div
            className="progress h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #4aadff, #a8deff)" }}
          />
        </div>

      </div>
    </main>
  );
}