"use client";

import { useState } from "react";
import { Phone, Send, RefreshCcw } from "lucide-react";
import api from "@/lib/api";

export default function USSDSimulator() {
  const [session, setSession] = useState<{
    text: string;
    sessionId: string;
    phoneNumber: string;
  }>({
    text: "",
    sessionId: Math.random().toString(36).substring(7),
    phoneNumber: "252636919012",
  });

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { type: "user" | "system"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [screenContent, setScreenContent] = useState<string | null>(null);

  // Start new session
  const startSession = async () => {
    setLoading(true);
    setMessages([]);
    setSession({
      ...session,
      text: "",
      sessionId: Math.random().toString(36).substring(7),
    }); // New ID
    try {
      // Backend expects: { sessionId, serviceCode, phoneNumber, text }
      const res = await api.post("/ussd", {
        // Note: Backend route is /api/ussd but might be mounted at /ussd too? Check app.ts
        sessionId: session.sessionId,
        serviceCode: "*789#",
        phoneNumber: session.phoneNumber,
        text: "",
      });
      setScreenContent(res.data.message);
    } catch (err) {
      console.error(err);
      setScreenContent("Connection Error");
    } finally {
      setLoading(false);
    }
  };

  const sendInput = async () => {
    if (!input) return;
    setLoading(true);

    // Append input to text path (e.g. 1*2)
    const newText = session.text ? `${session.text}*${input}` : input;

    try {
      const res = await api.post("/ussd", {
        // Check route prefix
        sessionId: session.sessionId,
        serviceCode: "*789#",
        phoneNumber: session.phoneNumber,
        text: newText,
      });

      setSession({ ...session, text: newText });
      setScreenContent(res.data.message);

      // If response type is END, reset session text but keep screen?
      // Usually USSD ends session.
      if (res.data.type === "END") {
        // Maybe show a "Session Ended" toast or state
        setTimeout(() => {
          setSession({ ...session, text: "" }); // Reset path for next dial
        }, 3000);
      }
    } catch (err) {
      setScreenContent("Error processing request");
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 rounded-[3rem] p-4 shadow-2xl border-4 border-gray-800 relative h-[700px] flex flex-col">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-2xl z-20"></div>

      {/* Screen */}
      <div className="bg-gray-100 flex-1 rounded-[2rem] overflow-hidden flex flex-col relative">
        {/* Status Bar */}
        <div className="h-8 bg-black/10 flex justify-between px-6 items-center text-xs font-bold text-gray-600 pt-2">
          <span>9:41</span>
          <span>5G</span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          {!screenContent ? (
            <div onClick={startSession} className="cursor-pointer group">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-4 mx-auto">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-500 font-medium">Dial *789#</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="bg-black/90 text-green-400 font-mono p-6 rounded-xl flex-1 text-left whitespace-pre-wrap shadow-inner border border-gray-700 overflow-y-auto">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  screenContent
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Reply..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendInput()}
                  disabled={loading}
                />
                <button
                  onClick={sendInput}
                  disabled={loading || !input}
                  className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => {
                  setScreenContent(null);
                  setSession({ ...session, text: "" });
                }}
                className="mt-4 text-red-500 text-sm font-medium hover:underline"
              >
                End Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Home Bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
    </div>
  );
}
