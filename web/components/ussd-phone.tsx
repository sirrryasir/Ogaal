"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Phone, Delete, Send } from "lucide-react";
import { getWaterSources, WaterSource } from "@/lib/data";

interface UssdPhoneProps {
  sources: WaterSource[];
}

export default function UssdPhone({ sources }: UssdPhoneProps) {
  const [screenText, setScreenText] = useState("");
  const [session, setSession] = useState<{ step: string; data?: any } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // USSD Logic State Machine
  const handleSend = async () => {
    setLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const text = screenText.trim();
    let response = "Try again.";
    let nextStep = session?.step || "idle";
    let nextData = session?.data || {};

    if (!session) {
      if (text === "*123#") {
        response =
          "Ogaal Menu:\n1. Check Water\n2. Report Issue\n3. Drought Risk\n4. Exit";
        nextStep = "main_menu";
      } else {
        response = "Invalid Code. Dial *123#";
        nextStep = "idle";
      }
    } else {
      switch (session.step) {
        case "main_menu":
          if (text === "1") {
            response =
              "Select Village:\n" +
              sources
                .slice(0, 3)
                .map((s, i) => `${i + 1}. ${s.village}`)
                .join("\n");
            nextStep = "check_water_village";
          } else if (text === "2") {
            response =
              "Select Village to Report:\n" +
              sources
                .slice(0, 3)
                .map((s, i) => `${i + 1}. ${s.village}`)
                .join("\n");
            nextStep = "report_village";
          } else if (text === "3") {
            response =
              "Drought Alert:\nRisk Level: LOW\nRainfall expected tomorrow.\nSelect 0 to Back.";
            nextStep = "drought_info";
          } else {
            response = "Session Ended.";
            nextStep = "idle";
          }
          break;

        case "check_water_village":
          const idx = parseInt(text) - 1;
          if (sources[idx]) {
            const s = sources[idx];
            response = `${
              s.name
            }:\nStatus: ${s.status.toUpperCase()}\nLast: Today\n\n00. Back`;
            nextStep = "main_menu"; // Simplified loop back or exit
          } else {
            response = "Invalid choice.\n0. Back";
            nextStep = "main_menu";
          }
          break;

        case "report_village":
          const rIdx = parseInt(text) - 1;
          if (sources[rIdx]) {
            nextData = { sourceId: sources[rIdx].id };
            response =
              "Choose Status:\n1. Working\n2. Low Water\n3. No Water\n4. Broken";
            nextStep = "report_status";
          } else {
            response = "Invalid. 0. Back";
            nextStep = "main_menu";
          }
          break;

        case "report_status":
          const statusMap = {
            "1": "working",
            "2": "low",
            "3": "no_water",
            "4": "broken",
          };
          // @ts-ignore
          const status = statusMap[text];
          if (status) {
            // Here we would call the server action
            response = "Report Sent!\nThank you.\n\n0. Menu";
            nextStep = "main_menu";
          } else {
            response = "Invalid options.";
            nextStep = "report_village";
          }
          break;

        default:
          response = "Session reset.";
          nextStep = "idle";
      }
    }

    if (nextStep === "idle") {
      setSession(null);
    } else {
      setSession({ step: nextStep, data: nextData });
    }

    // In USSD, the screen text is usually cleared or replaced by response in a popup for input,
    // but here we simulate the "Response" screen and then clearing input for next reply.
    // For this simulation, we'll show the response in a "screen" div and clear input.
    setScreenText("");
    setLoading(false);
    setLastResponse(response);
  };

  const [lastResponse, setLastResponse] = useState("Dial *123# to start");

  return (
    <div className="w-[300px] h-[600px] bg-black rounded-[40px] p-4 shadow-2xl border-4 border-gray-800 relative mx-auto">
      {/* Screen */}
      <div className="bg-green-100 h-2/3 w-full rounded-t-2xl p-4 font-mono text-sm whitespace-pre-wrap overflow-y-auto mb-4 border-b-4 border-gray-200">
        <div className="text-xs text-gray-500 mb-2 border-b border-gray-300 pb-1 flex justify-between">
          <span>Telesom</span>
          <span>3G</span>
        </div>
        <div className="text-black font-bold">
          {loading ? "USSD Code Running..." : lastResponse}
        </div>
      </div>

      {/* Keypad */}
      <div className="h-1/3 w-full flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={screenText}
            onChange={(e) => setScreenText(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded text-center font-mono tracking-widest text-lg"
            placeholder=""
          />
        </div>
        <div className="grid grid-cols-3 gap-2 flex-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
            <button
              key={key}
              onClick={() => setScreenText((prev) => prev + key)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold rounded flex items-center justify-center active:bg-gray-500 transition-colors"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={() => setScreenText((prev) => prev.slice(0, -1))}
            className="bg-red-900 hover:bg-red-800 text-white rounded p-2 flex justify-center items-center"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            className="bg-green-700 hover:bg-green-600 text-white rounded p-2 flex justify-center items-center font-bold"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
