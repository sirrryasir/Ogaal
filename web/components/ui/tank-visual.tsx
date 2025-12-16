"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TankVisualProps {
  percentage: number; // 0 to 100
  className?: string;
}

export default function TankVisual({ percentage, className }: TankVisualProps) {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Determine color based on level
  const waterColor =
    clampedPercentage < 20
      ? "bg-red-500"
      : clampedPercentage < 40
      ? "bg-orange-500"
      : "bg-cyan-500";

  return (
    <div
      className={cn(
        "relative w-full aspect-square max-w-[200px] mx-auto",
        className
      )}
    >
      {/* Tank Container */}
      <div className="absolute inset-0 border-4 border-gray-300 rounded-2xl overflow-hidden bg-gray-50 backdrop-blur-sm z-10">
        <div className="absolute inset-0 bg-white/50 z-20 pointer-events-none" />
      </div>

      {/* Water Level */}
      <div className="absolute inset-[4px] rounded-[12px] overflow-hidden z-0 bg-white">
        <motion.div
          className={cn(
            "absolute bottom-0 left-0 right-0 w-full transition-colors duration-1000",
            waterColor
          )}
          initial={{ height: "0%" }}
          animate={{ height: `${clampedPercentage}%` }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 60,
          }}
        >
          {/* Waves */}
          <motion.div
            className="absolute top-[-10px] left-0 right-0 h-[20px] bg-inherit opacity-50"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            style={{
              borderRadius: "50%",
              width: "200%",
            }}
          />
        </motion.div>
      </div>

      {/* Measurement Lines */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between py-4 px-2 opacity-30">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-full h-px border-t border-dashed border-gray-900"
          />
        ))}
      </div>

      {/* Percentage Text */}
      <div className="absolute inset-0 z-40 flex items-center justify-center">
        <span className="text-3xl font-black text-gray-900 drop-shadow-sm bg-white/80 px-3 py-1 rounded-full backdrop-blur-md">
          {Math.round(clampedPercentage)}%
        </span>
      </div>
    </div>
  );
}
