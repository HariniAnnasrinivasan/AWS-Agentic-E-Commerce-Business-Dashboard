'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Suggestion {
    title: string;
    query: string;
}

interface ChatOverlayProps {
    agentName?: string;
    apiEndpoint: string;
    suggestions: Suggestion[];
}

export function ChatOverlay({ agentName = "Business Agent", apiEndpoint, suggestions }: ChatOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
        { role: 'bot', text: `Hello! I am the ${agentName}. Ask me anything about your data.` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, sessionId })
            });

            const data = await res.json();

            if (data.sessionId) setSessionId(data.sessionId);

            if (data.error) {
                setMessages(prev => [...prev, { role: 'bot', text: `Error: ${data.error}` }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: data.response || "No response." }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: "Failed to connect to agent." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25",
                    isOpen && "hidden"
                )}
            >
                <MessageSquare className="w-8 h-8" />
                <span className="font-bold text-xl">Ask {agentName}</span>
            </button>

            {/* Slide-over Panel */}
            <div className={cn(
                "fixed inset-y-0 right-0 z-[60] w-full md:w-[700px] lg:w-[800px] bg-slate-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Bot className="w-10 h-10 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-3xl">{agentName}</h3>
                            <p className="text-slate-400 text-base">Powered by AWS Bedrock</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-950/50">

                    {/* Suggested Questions Grid */}
                    {messages.length <= 1 && suggestions && suggestions.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {suggestions.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(item.query)}
                                    className="text-left p-5 rounded-2xl bg-slate-800/50 border border-white/5 hover:bg-blue-600/10 hover:border-blue-500/50 hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] transition-all duration-300 group"
                                >
                                    <h4 className="font-bold text-blue-400 text-sm mb-1 group-hover:text-blue-300 uppercase tracking-wider">{item.title}</h4>
                                    <p className="text-slate-400 text-sm leading-snug group-hover:text-slate-200">
                                        Ask about <span className="text-white/80">{item.title.toLowerCase()}</span>...
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[85%] p-6 rounded-3xl text-lg leading-relaxed tracking-wide shadow-md",
                                msg.role === 'user'
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-slate-800 text-slate-100 border border-white/5 rounded-bl-none"
                            )}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex w-full justify-start">
                            <div className="bg-slate-800 p-6 rounded-3xl rounded-bl-none border border-white/5 flex gap-2 items-center">
                                <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
                                <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-8 border-t border-white/10 bg-slate-900">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-4"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Ask ${agentName}...`}
                            className="flex-1 bg-slate-800 border-white/10 text-white placeholder:text-slate-500 focus:ring-blue-500 focus:border-blue-500 h-16 text-xl px-6 rounded-xl"
                            disabled={isLoading}
                        />
                        <Button type="submit" size="icon" className="h-16 w-16 rounded-xl bg-blue-600 hover:bg-blue-500 text-white" disabled={isLoading}>
                            <Send className="w-8 h-8" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                />
            )}
        </>
    );
}
