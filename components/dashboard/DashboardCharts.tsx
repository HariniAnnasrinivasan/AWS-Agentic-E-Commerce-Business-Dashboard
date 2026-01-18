'use client';

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DashboardChartsProps {
    data: {
        revenueTrend: { month: string; revenue: number; orders: number }[];
        categorySales: { category: string; sales: number }[];
        paymentStatus: { status: string; count: number }[];
        deliveryDelays: { month: string; delayed: number }[];
    } | null;
}

// Neon/Cyberpunk inspired palette for dark mode
const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6'];
const AXIS_COLOR = "#94a3b8"; // slate-400
const GRID_COLOR = "#334155"; // slate-700
const CARD_BG = "bg-slate-900/50 border-white/10 backdrop-blur-md";

export function DashboardCharts({ data }: DashboardChartsProps) {
    if (!data) return <div className="p-8 text-center text-slate-400 font-medium animate-pulse">Loading charts...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Graph 1: Revenue Over Time */}
            <Card className={`col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.revenueTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis
                                dataKey="month"
                                stroke={AXIS_COLOR}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: AXIS_COLOR }}
                                dy={10}
                            />
                            <YAxis
                                stroke={AXIS_COLOR}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                                tick={{ fill: AXIS_COLOR }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                                itemStyle={{ color: '#e2e8f0' }}
                                cursor={{ stroke: '#64748b' }}
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#818cf8" // Indigo 400
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#818cf8', strokeWidth: 2, stroke: '#1e293b' }}
                                activeDot={{ r: 6, fill: '#6366f1' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Graph 2: Orders Over Time */}
            <Card className={`col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Orders Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.revenueTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis
                                dataKey="month"
                                stroke={AXIS_COLOR}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: AXIS_COLOR }}
                                dy={10}
                            />
                            <YAxis
                                stroke={AXIS_COLOR}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: AXIS_COLOR }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                stroke="#34d399" // Emerald 400
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#34d399', strokeWidth: 2, stroke: '#1e293b' }}
                                activeDot={{ r: 6, fill: '#10b981' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Graph 3: Category-wise Sales */}
            <Card className={`col-span-1 md:col-span-2 lg:col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Category-wise Sales</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.categorySales} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="category"
                                type="category"
                                width={100}
                                stroke={AXIS_COLOR}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: AXIS_COLOR }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                                itemStyle={{ color: '#e2e8f0' }}
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Sales']}
                            />
                            <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={32}>
                                {data.categorySales.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Graph 4: Payment Status Breakdown */}
            <Card className={`col-span-1 md:col-span-1 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.paymentStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="status"
                                stroke="none"
                                label={({ name, percent }: any) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                            >
                                {data.paymentStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Graph 5: Delivery Delays Trend */}
            <Card className={`col-span-1 md:col-span-2 shadow-lg ${CARD_BG}`}>
                <CardHeader>
                    <CardTitle className="text-slate-100">Delivery Delays Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.deliveryDelays}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOR} opacity={0.5} />
                            <XAxis
                                dataKey="month"
                                stroke={AXIS_COLOR}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: AXIS_COLOR }}
                                dy={10}
                            />
                            <YAxis
                                stroke={AXIS_COLOR}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: AXIS_COLOR }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
                                itemStyle={{ color: '#e2e8f0' }}
                                cursor={{ fill: '#1e293b' }}
                            />
                            <Bar dataKey="delayed" fill="#f87171" radius={[4, 4, 0, 0]} name="Delayed Deliveries" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
