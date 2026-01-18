'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeedbackChartsProps {
    data: {
        ratingDist: any[];
        sentimentTrend: any[];
        negativeByCategory: any[];
        complaintsByProduct: any[];
    }
}

export function FeedbackCharts({ data }: FeedbackChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. Rating Distribution */}
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-white">Rating Distribution</CardTitle>
                    <p className="text-sm text-slate-400">Customer feedback breakdown by star rating</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.ratingDist}>
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
                                />
                                <Bar dataKey="value" fill="#facc15" radius={[4, 4, 0, 0]} name="Reviews" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Sentiment Trend */}
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-white">Daily Sentiment Trend</CardTitle>
                    <p className="text-sm text-slate-400">Evolution of customer sentiment over time</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.sentimentTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="date"
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
                                />
                                <Legend />
                                <Line type="monotone" dataKey="Positive" stroke="#4ade80" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="Neutral" stroke="#94a3b8" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="Negative" stroke="#f87171" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Negative Feedback by Category */}
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-white">Issues by Category</CardTitle>
                    <p className="text-sm text-slate-400">Volume of negative feedback per category</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.negativeByCategory} layout="vertical">
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
                                />
                                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} name="Negative Reviews" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 4. Top Product Complaints */}
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-white">Most Complained Products</CardTitle>
                    <p className="text-sm text-slate-400">Products with highest volume of negative reviews</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.complaintsByProduct} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={120}
                                    stroke="#94a3b8"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} name="Complaints" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
