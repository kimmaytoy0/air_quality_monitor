'use client';

import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";

import { 
  Wind, 
  Thermometer, 
  Cloud, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';

import { useEffect, useState } from 'react';

interface SensorData {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: 'good' | 'moderate' | 'poor';
  icon: typeof Wind;
  trend: number;
}

export default function Dashboard() {

  const [sensorData, setSensorData] = useState<SensorData[]>([
    {
      id: "air",
      label: "Air Quality",
      value: 0,
      unit: "ppm",
      status: "good",
      icon: Wind,
      trend: 0
    },
    {
      id: "temp",
      label: "Temperature",
      value: 0,
      unit: "°C",
      status: "good",
      icon: Thermometer,
      trend: 0
    },
    {
      id: "pressure",
      label: "Pressure",
      value: 0,
      unit: "hPa",
      status: "good",
      icon: Cloud,
      trend: 0
    }
  ]);
  const [currentTime, setCurrentTime] = useState<string>("");

  /* ---------------------------
     REAL TIME CLOCK (CLIENT ONLY)
  ---------------------------- */
  useEffect(() => {

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  /* ---------------------------
     FIREBASE REAL TIME DATA
  ---------------------------- */
  useEffect(() => {

    const sensorRef = ref(database, "air_monitor");

    const unsubscribe = onValue(sensorRef, (snapshot) => {

      const data = snapshot.val();
      if (!data) return;

      const sensors: SensorData[] = [
        {
          id: 'air',
          label: 'Air Quality',
          value: Number(data.air_quality ?? 0),
          unit: 'ppm',
          status: data.air_quality < 200 ? 'good' : data.air_quality < 400 ? 'moderate' : 'poor',
          icon: Wind,
          trend: 0
        },
        {
          id: 'temp',
          label: 'Temperature',
          value: Number(data.temperature ?? 0),
          unit: '°C',
          status: 'good',
          icon: Thermometer,
          trend: 0
        },
        {
          id: 'pressure',
          label: 'Pressure',
          value: Number(data.pressure ?? 0),
          unit: 'hPa',
          status: 'good',
          icon: Cloud,
          trend: 0
        }
      ];

      setSensorData(sensors);

    });

    return () => unsubscribe();

  }, []);

  /* ---------------------------
     STATUS COLORS
  ---------------------------- */

  const getStatusColor = (status: string) => {

    switch (status) {
      case 'good':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';

      case 'moderate':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';

      case 'poor':
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';

      default:
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
    }

  };

  const getStatusBadgeColor = (status: string) => {

    switch (status) {
      case 'good':
        return 'bg-green-500/20 text-green-300 border-green-500/30';

      case 'moderate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';

      case 'poor':
        return 'bg-red-500/20 text-red-300 border-red-500/30';

      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a1f] to-[#0f0a1a] relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]"></div>

      <div className="relative z-10">

        {/* HEADER */}
        <header className="border-b border-purple-500/20 bg-gray-900/30 backdrop-blur-xl">

          <div className="max-w-7xl mx-auto px-6 py-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                  <Wind className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-white">
                    Air Quality Monitor
                  </h1>

                  <p className="text-xs text-purple-300">
                    Real-time environmental data
                  </p>
                </div>

              </div>

              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400">
                  {currentTime}
                </p>
              </div>

            </div>

          </div>

        </header>

        {/* MAIN */}
        <main className="max-w-7xl mx-auto px-6 py-8">

          {/* STATUS BANNER */}
          <div className="mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl">

            <div className="flex items-center justify-between flex-wrap gap-4">

              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Overall Air Quality
                </h2>

                <p className="text-purple-300">
                  Last updated: {currentTime}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-300">
                  System Online
                </span>
              </div>

            </div>

          </div>

          {/* SENSOR GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {sensorData.map((sensor) => {

              const Icon = sensor.icon;

              return (

                <div
                  key={sensor.id}
                  className={`bg-gradient-to-br ${getStatusColor(sensor.status)} backdrop-blur-xl border rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
                >

                  {/* HEADER */}
                  <div className="flex items-start justify-between mb-4">

                    <div className="bg-gray-900/50 p-3 rounded-xl">
                      <Icon className="w-6 h-6 text-purple-300" />
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusBadgeColor(sensor.status)}`}>
                      {sensor.status.toUpperCase()}
                    </span>

                  </div>

                  {/* VALUE */}
                  <div className="mb-4">

                    <h3 className="text-sm text-gray-400 mb-1">
                      {sensor.label}
                    </h3>

                    <div className="flex items-end gap-2">

                      <span className="text-4xl font-bold text-white">
                        {sensor.value}
                      </span>

                      <span className="text-lg text-gray-400 mb-1">
                        {sensor.unit}
                      </span>

                    </div>

                  </div>

                  {/* TREND */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-700/50">

                    <TrendingUp
                      className={`w-4 h-4 ${sensor.trend > 0
                        ? 'text-red-400'
                        : 'text-green-400 rotate-180'
                        }`}
                    />

                    <span className="text-xs text-gray-400">
                      {sensor.trend > 0 ? '+' : ''}
                      {sensor.trend.toFixed(1)}% from last hour
                    </span>

                  </div>

                </div>

              );

            })}

          </div>

          {/* INFO FOOTER */}
          <div className="mt-8 bg-gray-900/30 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">

            <h3 className="text-lg font-bold text-white mb-3">
              Air Quality Index Guide
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Good
                  </p>

                  <p className="text-xs text-gray-400">
                    Air quality is satisfactory
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Moderate
                  </p>

                  <p className="text-xs text-gray-400">
                    Acceptable for most people
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Poor
                  </p>

                  <p className="text-xs text-gray-400">
                    May cause health effects
                  </p>
                </div>
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}