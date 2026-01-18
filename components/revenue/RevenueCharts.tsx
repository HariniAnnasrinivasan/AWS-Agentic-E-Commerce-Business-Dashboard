'use client';

import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RevenueChartsProps {
    data: {
        revenueTrend: { month: string; revenue: number }[];
        categoryRevenue: { category: string; revenue: number }[];
        brandRevenue: { brand: string; revenue: number }[];
        aovTrend: { month: string; aov: number }[];
        paymentSplit: { mode: string; revenue: number }[];
    } | null;
}

// Neon Palette: Pink, Cyan, Violet, Amber
const COLORS = ['#f472b6', '#22d3ee', '#a78bfa', '#fbbf24', '#34d399', '#f87171'];
const AXIS_COLOR = "#94a3b8";
const GRID_COLOR = "#334155";
const CARD_BG = "bg-slate-900/50 border-white/10 backdrop-blur-md";

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                <p className="text-slate-300 text-sm mb-1">{label}</p>
                <p className="text-white font-bold text-lg">
                    {formatter ? formatter(payload[0].value) : payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

export function RevenueCharts({ data }: RevenueChartsProps) {
    if (!data) return <div className="text-slate-400 animate-pulse">Loading revenue analytics...</div>;

    const currencyFormatter = (value: any) => `$${Number(value).toLocaleString()}`;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Revenue Trend Over Time */}
            <Card className={`col-span-1 md:col-span-2 lg:col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.revenueTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis dataKey="month" stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                            <Tooltip content={<CustomTooltip formatter={currencyFormatter} />} cursor={{ stroke: '#f472b6', strokeWidth: 1 }} />
                            <Line type="monotone" dataKey="revenue" stroke="#f472b6" strokeWidth={3} dot={{ r: 4, fill: '#f472b6', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 6, fill: '#db2777' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 2. Category Revenue */}
            <Card className={`col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Revenue by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.categoryRevenue}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis dataKey="category" stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                            <Tooltip content={<CustomTooltip formatter={currencyFormatter} />} cursor={{ fill: '#1e293b' }} />
                            <Bar dataKey="revenue" fill="#22d3ee" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 3. Brand Revenue (Horizontal) */}
            <Card className={`col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Top Brands by Revenue</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.brandRevenue} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="brand" type="category" width={100} stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip formatter={currencyFormatter} />} cursor={{ fill: '#1e293b' }} />
                            <Bar dataKey="revenue" fill="#a78bfa" radius={[0, 4, 4, 0]} barSize={20}>
                                {data.brandRevenue.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 4. AOV Trend */}
            <Card className={`col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Average Order Value (AOV)</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.aovTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis dataKey="month" stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke={AXIS_COLOR} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                            <Tooltip content={<CustomTooltip formatter={currencyFormatter} />} cursor={{ stroke: '#fbbf24' }} />
                            <Line type="monotone" dataKey="aov" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4, fill: '#fbbf24', strokeWidth: 2, stroke: '#0f172a' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 5. Payment Split */}
            <Card className={`col-span-1 md:col-span-2 lg:col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Revenue by Payment Mode</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.paymentSplit}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="revenue"
                                nameKey="mode"
                                stroke="none"
                            >
                                {data.paymentSplit.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip formatter={currencyFormatter} />} />
                            <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
