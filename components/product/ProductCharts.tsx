'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductChartsProps {
    data: {
        bestSelling: any[];
        revenueByProduct: any[];
        stockLevels: any[];
        categoryPerf: any[];
        brandPerf: any[];
    }
}

export function ProductCharts({ data }: ProductChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. Best Selling Products */}
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-white">Best Selling Products</CardTitle>
                    <p className="text-sm text-slate-400">Top products by total quantity sold</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.bestSelling}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    angle={-15}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Units Sold" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Revenue by Product */}
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-white">Revenue Leaders</CardTitle>
                    <p className="text-sm text-slate-400">Products generating the most revenue</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.revenueByProduct} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    stroke="#94a3b8"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    formatter={(value: any) => [`$${(value || 0).toLocaleString()}`, 'Revenue']}
                                />
                                <Bar dataKey="value" fill="#34d399" radius={[0, 4, 4, 0]} name="Revenue" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Inventory Stock Levels */}
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-white">Low Stock Alert</CardTitle>
                    <p className="text-sm text-slate-400">Products with the lowest inventory levels</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.stockLevels}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    angle={-15}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#f472b6"
                                    radius={[4, 4, 0, 0]}
                                    name="Stock Qty"
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Brand Performance */}
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-white">Top Brands</CardTitle>
                    <p className="text-sm text-slate-400">Best performing brands by volume</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.brandPerf}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="value" fill="#a78bfa" radius={[4, 4, 0, 0]} name="Units Sold" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 5. Category Performance (Dual Axis) */}
            <Card className="col-span-1 lg:col-span-2 bg-slate-900/50 border-white/10 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-white">Category Performance Metrics</CardTitle>
                    <p className="text-sm text-slate-400">Comparing sales volume vs. revenue generated per category</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.categoryPerf} margin={{ top: 20, right: 80, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    stroke="#60a5fa"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    label={{ value: 'Sales Qty', angle: -90, position: 'insideLeft', fill: '#60a5fa' }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    stroke="#34d399"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    label={{ value: 'Revenue ($)', angle: 90, position: 'right', fill: '#34d399', offset: 25 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    formatter={(value: number, name: string) => {
                                        if (name === 'Revenue') return [`$${value.toLocaleString()}`, name];
                                        return [value.toLocaleString(), name];
                                    }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="sales" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Sales Qty" />
                                <Bar yAxisId="right" dataKey="revenue" fill="#34d399" radius={[4, 4, 0, 0]} name="Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
