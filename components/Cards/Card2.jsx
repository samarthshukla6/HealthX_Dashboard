import React, { useEffect, useRef } from 'react';
import { AI_ASSISTANT_NAME } from "@/lib/assistant";

const Card2 = ({ transcript = [], compact = false }) => {
    const transcriptContainerRef = useRef(null);
    const transcriptEndRef = useRef(null);
    
    useEffect(() => {
        if (transcriptEndRef.current && transcriptContainerRef.current) {
            transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
        }
    }, [transcript]);
    
    if (compact) {
        return (
            <div ref={transcriptContainerRef} className="h-full min-h-0 overflow-y-auto text-gray-600 space-y-2 pr-1 scrollbar-hide">
                {transcript.length === 0 ? (
                    <p className="text-slate-400 italic text-xs">Transcription will appear here as you speak...</p>
                ) : (
                    transcript.map((entry, index) => {
                        if (!entry || typeof entry !== 'object') return null;
                        
                        const role = entry.role || "unknown";
                        const content =
                            entry.content ||
                            entry.text ||
                            entry.message ||
                            entry.transcript ||
                            entry.value ||
                            (typeof entry === 'string' ? entry : "") ||
                            "";
                        
                        return (
                            <div
                                key={index}
                                className={`p-2 rounded-lg text-xs ${
                                    role === 'user'
                                        ? 'bg-slate-50 border border-slate-100'
                                        : 'bg-indigo-50/70 border border-indigo-100'
                                }`}
                            >
                                <p className="break-words">
                                    <span className={`font-medium ${
                                        role === 'user' ? 'text-slate-800' : 'text-indigo-800'
                                    }`}>
                                        {role === 'user' ? 'You' : AI_ASSISTANT_NAME}:
                                    </span>{" "}
                                    <span className="text-slate-600">{content}</span>
                                </p>
                            </div>
                        );
                    })
                )}
                <div ref={transcriptEndRef} />
            </div>
        );
    }

    return (
        <div className="h-[400px] flex flex-col w-full rounded-2xl backdrop-blur-sm bg-transparent p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-indigo-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                    />
                </svg>
                Live Transcript
            </h2>
            <div 
                ref={transcriptContainerRef}
                className="flex-1 overflow-y-auto text-gray-600 space-y-3 pr-1 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                {transcript.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">Transcription will appear here as you speak...</p>
                ) : (
                    transcript.map((entry, index) => {
                        if (!entry || typeof entry !== 'object') return null;
                        
                        const role = entry.role || "unknown";
                        const content =
                            entry.content ||
                            entry.text ||
                            entry.message ||
                            entry.transcript ||
                            entry.value ||
                            (typeof entry === 'string' ? entry : "") ||
                            "";
                        
                        return (
                            <div 
                                key={index}
                                className={`p-2 rounded-lg ${
                                    role === 'user' 
                                        ? 'bg-white bg-opacity-50' 
                                        : 'bg-indigo-50 bg-opacity-50'
                                }`}
                            >
                                <p className="break-words">
                                    <span className={`font-medium ${
                                        role === 'user' 
                                            ? 'text-gray-900' 
                                            : 'text-indigo-900'
                                    }`}>
                                        {role === 'user' ? 'You' : AI_ASSISTANT_NAME}:
                                    </span>{" "}
                                    <span className="text-gray-700">{content}</span>
                                </p>
                            </div>
                        );
                    })
                )}
                <div ref={transcriptEndRef} />
            </div>
        </div>
    );
};

export default Card2;