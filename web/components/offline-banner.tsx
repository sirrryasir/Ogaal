"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const { setOffline } = useAppStore();

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);
    setOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setOffline(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register SW
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.log("SW Fail", err));
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOffline]);

  if (isOnline) return null;

  return (
    <div className="bg-gray-900 text-white text-xs font-bold py-1 px-4 text-center flex items-center justify-center animate-in slide-in-from-top-full">
      <WifiOff className="w-3 h-3 mr-2" />
      Offline Mode Active - Data cached locally
    </div>
  );
}
