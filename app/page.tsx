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
      className="flex items-center justify-center min-h-screen overflow-hidden relative"
      style={{ background: "#0a0010" }}
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
          20%  { opacity: 0.7; }
          80%  { opacity: 0.4; }
          100% { transform: translateY(-90px) rotate(15deg); opacity: 0; }
        }
        @keyframes svgReveal {
          0%   { opacity: 0; transform: translateY(14px) scale(0.92); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0px)  scale(1);    filter: blur(0px); }
        }
        @keyframes subtitleFade {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1);   }
          50%       { opacity: 0.7; transform: translate(-50%, -50%) scale(1.12); }
        }
        @keyframes progressBar {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes rotateSlow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes rotateSlowReverse {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes titleReveal {
          0%   { opacity: 0; letter-spacing: 0.6em; filter: blur(8px); }
          100% { opacity: 1; letter-spacing: 0.3em; filter: blur(0px); }
        }

        .wind-streak {
          position: absolute;
          height: 1.5px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.65), transparent);
          animation: windStreak linear infinite;
          will-change: transform;
        }
        .wind-streak-fast {
          position: absolute;
          height: 1px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(216, 180, 254, 0.45), transparent);
          animation: windStreakFast linear infinite;
          will-change: transform;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(192, 132, 252, 0.6);
          animation: floatUp ease-in-out infinite;
        }
        .svg-logo    { animation: svgReveal    1.0s cubic-bezier(0.22,1,0.36,1) 0.8s both; }
        .title-text  { animation: titleReveal  1.0s cubic-bezier(0.22,1,0.36,1) 0.4s both; }
        .sub-label   { animation: subtitleFade 0.8s ease 1.6s both; }
        .progress    { animation: progressBar  3s linear forwards; }

        .orbit-1 {
          position: absolute; border-radius: 50%; top: 50%; left: 50%;
          border: 1px solid rgba(147, 51, 234, 0.25);
          animation: rotateSlow 20s linear infinite;
        }
        .orbit-2 {
          position: absolute; border-radius: 50%; top: 50%; left: 50%;
          border: 1px solid rgba(216, 180, 254, 0.12);
          animation: rotateSlowReverse 32s linear infinite;
        }
        .glow-blob {
          position: absolute; top: 50%; left: 50%;
          border-radius: 50%;
          animation: pulseGlow 3.2s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      {/* ── Deep purple background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(88, 28, 135, 0.55) 0%, transparent 70%), " +
          "radial-gradient(ellipse 50% 40% at 20% 60%, rgba(107, 33, 168, 0.25) 0%, transparent 60%), " +
          "radial-gradient(ellipse 50% 40% at 80% 35%, rgba(126, 34, 206, 0.20) 0%, transparent 60%)",
      }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 35%, rgba(0,0,0,0.85) 100%)",
      }} />

      {/* ── Orbit rings ── */}
      <div className="orbit-1" style={{ width: 280, height: 280, marginTop: -140, marginLeft: -140 }} />
      <div className="orbit-2" style={{ width: 370, height: 370, marginTop: -185, marginLeft: -185 }} />

      {/* ── Glow blob ── */}
      <div className="glow-blob" style={{
        width: 220, height: 220, marginTop: -110, marginLeft: -110,
        background: "radial-gradient(circle, rgba(147,51,234,0.35) 0%, transparent 70%)",
      }} />

      {/* ── Wind streaks — slow ── */}
      {[
        { top: "9%",  width: "44%", dur: "3.6s", delay: "0s"   },
        { top: "23%", width: "57%", dur: "2.9s", delay: "0.5s" },
        { top: "39%", width: "48%", dur: "4.1s", delay: "1.0s" },
        { top: "55%", width: "62%", dur: "2.7s", delay: "0.3s" },
        { top: "69%", width: "39%", dur: "3.3s", delay: "1.4s" },
        { top: "83%", width: "53%", dur: "3.0s", delay: "0.7s" },
      ].map((s, i) => (
        <div key={`s${i}`} className="wind-streak"
          style={{ top: s.top, width: s.width, animationDuration: s.dur, animationDelay: s.delay }} />
      ))}

      {/* ── Wind streaks — fast ── */}
      {[
        { top: "17%", width: "25%", dur: "1.9s", delay: "0.2s" },
        { top: "32%", width: "18%", dur: "2.2s", delay: "0.8s" },
        { top: "47%", width: "31%", dur: "1.7s", delay: "0.4s" },
        { top: "62%", width: "22%", dur: "2.4s", delay: "1.1s" },
        { top: "76%", width: "28%", dur: "2.0s", delay: "0.6s" },
      ].map((s, i) => (
        <div key={`f${i}`} className="wind-streak-fast"
          style={{ top: s.top, width: s.width, animationDuration: s.dur, animationDelay: s.delay }} />
      ))}

      {/* ── Floating particles ── */}
      {[
        { left: "11%", top: "73%", size: 3, dur: "4.4s", delay: "0s"   },
        { left: "27%", top: "68%", size: 2, dur: "3.9s", delay: "0.7s" },
        { left: "51%", top: "77%", size: 4, dur: "5.2s", delay: "1.3s" },
        { left: "67%", top: "71%", size: 2, dur: "3.6s", delay: "0.2s" },
        { left: "82%", top: "75%", size: 3, dur: "4.7s", delay: "0.9s" },
        { left: "39%", top: "83%", size: 2, dur: "4.1s", delay: "0.4s" },
        { left: "59%", top: "61%", size: 3, dur: "3.3s", delay: "1.6s" },
        { left: "75%", top: "55%", size: 2, dur: "4.8s", delay: "1.0s" },
      ].map((p, i) => (
        <div key={`p${i}`} className="particle"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDuration: p.dur, animationDelay: p.delay }} />
      ))}

      {/* ── Centre content ── */}
      <div className="relative z-10 flex flex-col items-center gap-4">

        {/* LOGO_AIR SVG */}
        <div className="svg-logo mb-1">
          <Image
            src="/landing_air.svg"
            alt="LOGO_AIR"
            width={240}
            height={70}
            className="mx-auto"
            style={{ filter: "drop-shadow(0 0 18px rgba(168, 85, 247, 0.7)) drop-shadow(0 0 6px rgba(216,180,254,0.5))" }}
          />
        </div>

        {/* App name */}
        <h1
          className="title-text text-xs font-semibold uppercase"
          style={{
            letterSpacing: "0.3em",
            color: "rgba(216, 180, 254, 0.75)",
          }}
        >
          Air Quality Monitor
        </h1>

        {/* Divider */}
        <div style={{ width: 40, height: 1, background: "rgba(147, 51, 234, 0.5)", borderRadius: 999 }} />

        {/* Tagline */}
        <p
          className="sub-label text-xs"
          style={{ color: "rgba(192, 132, 252, 0.5)", letterSpacing: "0.15em" }}
        >
          Breathe. Monitor. Purify.
        </p>

        {/* Progress bar */}
        <div
          className="mt-4 rounded-full overflow-hidden"
          style={{ width: 150, height: 2, background: "rgba(107, 33, 168, 0.3)" }}
        >
          <div
            className="progress h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #7e22ce, #c084fc)" }}
          />
        </div>

      </div>
    </main>
  );
}