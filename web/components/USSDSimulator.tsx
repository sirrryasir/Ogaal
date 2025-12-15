'use client';

import React, { useState, useEffect } from 'react';

const USSDSimulator = () => {
    const [screenText, setScreenText] = useState('');
    const [input, setInput] = useState('');
    const [sessionActive, setSessionActive] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        // Reset simulation on load
    }, []);

    const startSession = async () => {
        const newSessionId = Math.random().toString(36).substring(7);
        setSessionId(newSessionId);
        setSessionActive(true);
        setHistory([]);
        await sendRequest(newSessionId, '*123#');
    };

    const sendRequest = async (sid: string, text: string) => {
        try {
            // Aggregate history for text
            // In this simple demo, we just send the current input or the accumulated path if we were sophisticated.
            // But our backend handles 'text' as the current input or full string. 
            // Let's send the full history joined by *.
            
            // If starting, text is empty or *123#
            let payloadText = '';
            if (text === '*123#') {
                payloadText = '';
            } else {
                // Determine full text based on history + current input
                // For simplicity, we'll just send the current input `text` to the backend logic 
                // which currently expects "1*2" format.
                // We need to maintain the full chain.
                const newHistory = [...history, text].filter(t => t !== '*123#');
                payloadText = newHistory.join('*');
            }

            const res = await fetch('http://localhost:3001/ussd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: sid,
                    serviceCode: '*123#',
                    phoneNumber: '254700000000',
                    text: payloadText
                })
            });
            const data = await res.json();
            setScreenText(data.message);
            
            if (data.type === 'END') {
                setSessionActive(false);
                setHistory([]);
            } else {
                if (text !== '*123#') {
                     setHistory(prev => [...prev, text]);
                }
            }
            setInput('');
        } catch (error) {
            setScreenText("Network Error");
            setSessionActive(false);
        }
    };

    const handleKey = (key: string) => {
        if (!sessionActive) {
            if (key === 'Call') {
                startSession();
            } else {
                setInput(prev => prev + key);
            }
            return;
        }

        if (key === 'Call') {
            // Usually 'Send' in USSD menu
            handleSubmit();
        } else if (key === 'Del') {
            setInput(prev => prev.slice(0, -1));
        } else {
            setInput(prev => prev + key);
        }
    };

    const handleSubmit = () => {
        if (sessionActive) {
            sendRequest(sessionId, input);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-3xl w-[320px] h-[640px] border-4 border-gray-800 shadow-2xl relative">
            {/* Phone Screen */}
            <div className="w-full h-[60%] bg-blue-500 rounded-t-xl overflow-hidden relative mb-4 flex flex-col items-center justify-center text-white p-4">
                <div className="absolute top-2 left-2 text-xs">Signal: 4G</div>
                <div className="absolute top-2 right-2 text-xs">12:00 PM</div>
                
                {sessionActive ? (
                    <div className="bg-white text-black w-full h-[80%] p-2 rounded shadow flex flex-col">
                        <pre className="whitespace-pre-wrap font-mono text-sm flex-grow">{screenText}</pre>
                        <div className="border-t border-gray-300 pt-1 mt-1">
                            <input 
                                type="text" 
                                value={input}
                                readOnly
                                className="w-full outline-none bg-transparent font-mono"
                                placeholder="Type here..."
                            />
                        </div>
                        <div className="text-right text-xs text-blue-600 mt-1 cursor-pointer" onClick={handleSubmit}>Send</div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center">
                        <div className="text-3xl mb-2">📞</div>
                        <div className="text-xl font-bold">AquaGuard</div>
                        <div className="text-sm mt-4">Dial *123# to start</div>
                        <div className="mt-8 text-2xl font-mono border-b-2 border-white min-h-[32px]">{input}</div>
                    </div>
                )}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4 w-full px-4 mb-8">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                    <button 
                        key={key}
                        onClick={() => handleKey(key)}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold shadow active:bg-gray-200"
                    >
                        {key}
                    </button>
                ))}
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-3 gap-4 w-full px-4">
                 <button onClick={() => setSessionActive(false)} className="col-span-1 bg-red-500 text-white rounded p-2 text-sm font-bold">End</button>
                 <button onClick={() => handleKey('Call')} className="col-span-1 bg-green-500 text-white rounded p-2 text-sm font-bold">Call/Send</button>
                 <button onClick={() => handleKey('Del')} className="col-span-1 bg-gray-400 text-white rounded p-2 text-sm font-bold">Del</button>
            </div>
        </div>
    );
};

export default USSDSimulator;
