'use client';

import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";

import {
  Wind,
  Thermometer,
  Cloud,
  Droplets,
  TrendingUp
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { useEffect, useState } from "react";

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

  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");

  const [chartData, setChartData] = useState<any[]>([]);

  /* ---------------------------
     REAL TIME CLOCK
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

      const newSensors: SensorData[] = [
        {
          id: "air",
          label: "Air Quality",
          value: Number(data.air_quality),
          unit: "ppm",
          status:
            data.air_quality < 200
              ? "good"
              : data.air_quality < 400
                ? "moderate"
                : "poor",
          icon: Wind,
          trend: 0
        },
        {
          id: "temp",
          label: "Temperature",
          value: Number(data.temperature),
          unit: "°C",
          status: "good",
          icon: Thermometer,
          trend: 0
        },
        {
          id: "pressure",
          label: "Pressure",
          value: Number(data.pressure),
          unit: "hPa",
          status: "good",
          icon: Cloud,
          trend: 0
        },
        {
          id: "humidity",
          label: "Humidity",
          value: Number(data.humidity),
          unit: "%",
          status:
            data.humidity < 60
              ? "good"
              : data.humidity < 80
                ? "moderate"
                : "poor",
          icon: Droplets,
          trend: 0
        },
        {
          id: "dust",
          label: "Dust",
          value: Number(data.dust),
          unit: "µg/m³",
          status:
            data.dust < 50
              ? "good"
              : data.dust < 100
                ? "moderate"
                : "poor",
          icon: Wind,
          trend: 0
        }
      ];

      setSensorData(newSensors);

      /* -------- Graph history -------- */

      const now = new Date().toLocaleTimeString();

      setChartData(prev => {

        const newEntry = {
          time: now,
          air: data.air_quality,
          temp: data.temperature,
          humidity: data.humidity,
          dust: data.dust
        };

        const updated = [...prev, newEntry];

        if (updated.length > 20) updated.shift();

        return updated;

      });

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

  const overallStatus = (() => {
    if (sensorData.length === 0) return null;
    const statuses = sensorData.map(s => s.status);
    if (statuses.includes('poor')) return 'poor';
    if (statuses.includes('moderate')) return 'moderate';
    return 'good';
  })();

  const overallLabel: Record<string, { text: string; color: string }> = {
    good: { text: 'Good', color: 'bg-green-500/20 text-green-400 border-green-500/40' },
    moderate: { text: 'Moderate', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
    poor: { text: 'Poor', color: 'bg-red-500/20 text-red-400 border-red-500/40' },
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a1f] to-[#0f0a1a]">

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

            <div className="flex items-center gap-4">

              {overallStatus && (
                <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold ${overallLabel[overallStatus].color}`}>
                  Overall: {overallLabel[overallStatus].text}
                </div>
              )}

              <p className="text-xs text-gray-400">
                {currentTime}
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-6 py-8">


        {/* GRAPH */}

        <div className="mb-8 bg-gray-900/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-6">

          <h2 className="text-xl font-bold text-white mb-4">
            Sensor Trends
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" stroke="#444" />

              <XAxis dataKey="time" stroke="#aaa" />

              <YAxis stroke="#aaa" />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="air"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="temp"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="dust"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>


        {/* SENSOR CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {sensorData.map((sensor) => {

            const Icon = sensor.icon;

            return (

              <div
                key={sensor.id}
                className={`bg-gradient-to-br ${getStatusColor(sensor.status)} backdrop-blur-xl border rounded-2xl p-6 shadow-xl`}
              >

                <div className="flex items-start justify-between mb-4">

                  <div className="bg-gray-900/50 p-3 rounded-xl">
                    <Icon className="w-6 h-6 text-purple-300" />
                  </div>

                </div>

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

            );

          })}

        </div>

      </main>

    </div>

  );
}