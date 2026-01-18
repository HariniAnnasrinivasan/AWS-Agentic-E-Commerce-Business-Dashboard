'use client';

import { BarChart3, Package, MessageSquare, Briefcase, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const agents = [
    {
        title: 'Revenue Insight',
        description: 'Financial metrics & revenue streams.',
        icon: BarChart3,
        id: 'revenue',
        color: 'text-blue-300',
        bg: 'bg-blue-500/20',
        border: 'hover:border-blue-400/50',
        glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]'
    },
    {
        title: 'Product Performance',
        description: 'Sales, stock & category trends.',
        icon: Package,
        id: 'product',
        color: 'text-purple-300',
        bg: 'bg-purple-500/20',
        border: 'hover:border-purple-400/50',
        glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]'
    },
    {
        title: 'Feedback Intelligence',
        description: 'Sentiment & customer insights.',
        icon: MessageSquare,
        id: 'feedback',
        color: 'text-amber-300',
        bg: 'bg-amber-500/20',
        border: 'hover:border-amber-400/50',
        glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]'
    },
    {
        title: 'Business Ops',
        description: 'Efficiency, delays & processes.',
        icon: Briefcase,
        id: 'operations',
        color: 'text-emerald-300',
        bg: 'bg-emerald-500/20',
        border: 'hover:border-emerald-400/50',
        glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]'
    },
];

export function NavigationCards() {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {agents.map((agent) => (
                <div
                    key={agent.id}
                    onClick={() => router.push(`/agent/${agent.id}`)}
                    className={`group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 ${agent.border} ${agent.glow} cursor-pointer`}
                >
                    <div>
                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${agent.bg} ${agent.color} mb-4 border border-white/5`}>
                            <agent.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-white mb-2 group-hover:text-white">
                            {agent.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                            {agent.description}
                        </p>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-semibold text-slate-500 group-hover:text-white transition-colors duration-300">
                        View Analytics <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            ))}
        </div>
    );
}
