import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: string; // e.g. "+5% from last month"
    trendColor?: 'text-emerald-400' | 'text-rose-400' | 'text-slate-400' | 'text-indigo-400' | 'text-amber-400' | 'text-blue-400' | 'text-purple-400';
    className?: string;
}

export function KPICard({ title, value, icon: Icon, trend, trendColor = 'text-emerald-400', className }: KPICardProps) {
    return (
        <div className={cn(
            "group relative overflow-hidden rounded-xl border border-white/10 bg-white/10 backdrop-blur-md shadow-xl transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] hover:shadow-2xl",
            className
        )}>
            {/* Subtle top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="p-5 flex flex-col justify-between h-full">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-xs font-bold text-slate-300 uppercase letter-spacing-wider">{title}</h3>
                    {Icon && <Icon className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors duration-300" />}
                </div>
                <div>
                    <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
                    {trend && (
                        <p className={cn("text-xs font-semibold mt-1", trendColor)}>
                            {trend}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
