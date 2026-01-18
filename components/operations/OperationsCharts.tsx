'use client';

import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface OperationsChartsProps {
    data: {
        delaysByCity: { city: string; value: number }[];
        processingDelaysByCity: { city: string; value: number }[];
        paymentFailureByCity: { city: string; value: number }[];
        cancellationByCity: { city: string; value: number }[];
        completionTimeTrend: { month: string; value: number }[];
    } | null;
}

// Operations Palette: Orange, Red, Amber, Slate
const COLORS = ['#fb923c', '#f87171', '#fbbf24', '#94a3b8', '#38bdf8'];
const AXIS_COLOR = "#94a3b8";
const GRID_COLOR = "#334155";
const CARD_BG = "bg-slate-900/50 border-white/10 backdrop-blur-md";

const CustomTooltip = ({ active, payload, label, unit = "" }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                <p className="text-slate-300 text-sm mb-1">{label}</p>
                <p className="text-white font-bold text-lg">
                    {payload[0].value.toFixed(1)}{unit}
                </p>
            </div>
        );
    }
    return null;
};

export function OperationsCharts({ data }: OperationsChartsProps) {
    if (!data) return <div className="text-slate-400 animate-pulse">Loading operations analytics...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 1. Delivery Delays by City */}
            <Card className={`col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Delivery Delays (Top Cities)</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.delaysByCity}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis dataKey="city" stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
                            <Bar dataKey="value" fill="#fb923c" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 2. Order Processing Delays by City */}
            <Card className={`col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Processing Delays</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.processingDelaysByCity}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis dataKey="city" stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
                            <Bar dataKey="value" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 3. Payment Failure Rate */}
            <Card className={`col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Payment Failure Rate (%)</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.paymentFailureByCity} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="city" type="category" width={100} stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip unit="%" />} cursor={{ fill: '#1e293b' }} />
                            <Bar dataKey="value" fill="#f87171" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 4. Cancellation Rate */}
            <Card className={`col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Cancellation Rate (%)</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.cancellationByCity} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="city" type="category" width={100} stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip unit="%" />} cursor={{ fill: '#1e293b' }} />
                            <Bar dataKey="value" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 5. Avg Order Completion Time */}
            <Card className={`col-span-1 md:col-span-2 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Avg Completion Time (Days)</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.completionTimeTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis dataKey="month" stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip unit=" days" />} cursor={{ stroke: '#38bdf8' }} />
                            <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#0f172a' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    );
}
