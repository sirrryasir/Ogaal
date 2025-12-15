"use client";

import { useState } from "react";
import { Droplets, Users, CloudRain, Sprout, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";
import TankVisual from "@/components/ui/tank-visual";

export default function CalculatorPage() {
  const [people, setPeople] = useState(6);
  const [animals, setAnimals] = useState(10);
  const [cropType, setCropType] = useState<"none" | "vegetables" | "sorghum">(
    "none"
  );
  const [tankSize, setTankSize] = useState(200); // Liters

  // Simple Logic
  const personUsage = 20; // Liters per day
  const animalUsage = 15; // Liters per day (avg goat/camel mix)
  const cropUsage =
    cropType === "none" ? 0 : cropType === "vegetables" ? 50 : 30;

  const dailyTotal = people * personUsage + animals * animalUsage + cropUsage;
  const daysLasting = Math.round((tankSize / dailyTotal) * 10) / 10;

  // Calculate percentage of water remaining relative to a standard "full" tank logic or just visual capacity
  // For the visual, let's treat 'tankSize' as the current volume, and maybe assume a max capacity context or just show full?
  // Actually, let's visualize "How full is the tank relative to daily usage?" or just a static tank that fills up as you increase size?
  // Let's make the tank visual represent the "Safe Zone".
  // If daysLasting > 7, it's full. If < 1, it's empty.
  const visualPercentage = Math.min((daysLasting / 7) * 100, 100);

  const getSeverityColor = () => {
    if (daysLasting < 1) return "text-red-500";
    if (daysLasting < 3) return "text-orange-500";
    return "text-green-500";
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Water Planner
            </h1>
            <p className="text-gray-500">
              Estimate your survival timeline based on current resources.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-8">
            {/* People Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-bold text-gray-700 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  Family Size
                </label>
                <span className="font-mono text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {people}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={people}
                onChange={(e) => setPeople(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Animals Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-bold text-gray-700 flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600 font-bold leading-none flex items-center justify-center w-9 h-9">
                    🐐
                  </div>
                  Livestock
                </label>
                <span className="font-mono text-lg font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                  {animals}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={animals}
                onChange={(e) => setAnimals(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* Crops Input */}
            <div className="space-y-3">
              <label className="font-bold text-gray-700 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Sprout className="w-5 h-5" />
                </div>
                Crops
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["none", "vegetables", "sorghum"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCropType(c as any)}
                    className={cn(
                      "py-3 rounded-xl text-sm font-bold border-2 transition-all capitalize",
                      cropType === c
                        ? "border-green-500 bg-green-50 text-green-700 shadow-sm transform scale-[1.02]"
                        : "border-slate-100 bg-white text-gray-400 hover:border-slate-200"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  Stored Water
                </label>
                <span className="font-mono text-lg font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-lg">
                  {tankSize} L
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={tankSize}
                onChange={(e) => setTankSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Results & Visualization */}
        <div className="flex flex-col gap-6">
          {/* Summary Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Droplets className="w-32 h-32 text-blue-600" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-4">
                Water Autonomy
              </h3>

              <TankVisual
                percentage={visualPercentage}
                className="mb-6 w-48 h-48"
              />

              <div className="space-y-1">
                <p className="text-gray-500 font-medium">
                  Your supply will last
                </p>
                <motion.div
                  key={daysLasting}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "text-5xl font-black tracking-tight",
                    getSeverityColor()
                  )}
                >
                  {daysLasting} Days
                </motion.div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Daily Usage
              </p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {dailyTotal} L
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-xs font-bold text-gray-400 uppercase">
                People Usage
              </p>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {people * personUsage} L
              </p>
            </div>
          </div>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "p-5 rounded-2xl border-l-4 text-sm font-medium leading-relaxed",
              daysLasting < 2
                ? "bg-red-50 border-red-500 text-red-700"
                : "bg-blue-50 border-blue-500 text-blue-700"
            )}
          >
            {daysLasting < 2
              ? "CRITICAL WARNING: You are approaching a water emergency. Reduce livestock watering immediately or contact the nearest water distribution node."
              : "Status OK. Continue monitoring your levels. Consider covering your tank to reduce evaporation by up to 30%."}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
