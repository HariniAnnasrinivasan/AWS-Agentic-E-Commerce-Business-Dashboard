import {
    getRevenueMetrics,
    getRevenueGraphs,
    getRevenueInsights
} from '@/lib/metrics-revenue';
import { RevenueCharts } from '@/components/revenue/RevenueCharts';
import { ChatOverlay } from '@/components/ui/ChatOverlay';
import { KPICard } from '@/components/ui/KPICard';
import {
    TrendingUp,
    DollarSign,
    ShoppingBag,
    Users,
    Tag,
    Award,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RevenueAgentPage() {
    const [metrics, graphs, insights] = await Promise.all([
        getRevenueMetrics(),
        getRevenueGraphs(),
        getRevenueInsights()
    ]);

    return (
        <div className="min-h-screen p-6 md:p-8 font-sans pb-32">
            <div className="max-w-[1600px] mx-auto space-y-10">

                {/* Header & Nav */}
                <div className="flex flex-col gap-6">
                    <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>
                    <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
                        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-sm flex items-center gap-4">
                            <TrendingUp className="w-10 h-10 text-blue-400" />
                            Revenue Insight Agent
                        </h1>
                        <p className="text-slate-300 font-medium text-lg tracking-wide ml-14">
                            Deep dive into financial performance, product success, and customer value.
                        </p>
                    </div>
                </div>

                {/* Section 1: KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    <KPICard
                        title="Total Revenue (All-Time)"
                        value={`$${metrics.totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        trendColor="text-blue-400"
                    />
                    <KPICard
                        title="Revenue (This Month)"
                        value={`$${metrics.monthRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        trend="CURRENT"
                        trendColor="text-emerald-400"
                    />
                    <KPICard
                        title="Avg Order Value"
                        value={`$${metrics.avgOrderValue.toFixed(2)}`}
                        icon={TrendingUp}
                        trendColor="text-amber-400"
                    />
                    <KPICard
                        title="Paying Customers"
                        value={metrics.payingCustomers.toLocaleString()}
                        icon={Users}
                        trendColor="text-purple-400"
                    />
                    <KPICard
                        title="Top Category"
                        value={metrics.topCategory}
                        icon={Tag}
                        className="xl:col-span-1"
                    />
                    <KPICard
                        title="Top Product"
                        value={metrics.topProduct}
                        icon={Award}
                        className="xl:col-span-1"
                    />
                </div>

                {/* Section 2: Insight Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
                        <h3 className="text-emerald-400 font-bold mb-2 uppercase text-xs tracking-wider">Peak Performance</h3>
                        <p className="text-white text-lg">
                            Highest revenue recorded in <span className="font-bold text-emerald-300">{insights.peakMonth}</span> with <span className="font-bold">${insights.peakRevenue.toLocaleString()}</span>.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/10 backdrop-blur-md">
                        <h3 className="text-rose-400 font-bold mb-2 uppercase text-xs tracking-wider">Area for Growth</h3>
                        <p className="text-white text-lg">
                            Lowest activity observed in <span className="font-bold text-rose-300">{insights.lowestMonth}</span>. Consider seasonal campaigns.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
                        <h3 className="text-blue-400 font-bold mb-2 uppercase text-xs tracking-wider">Product Strategy</h3>
                        <p className="text-white text-lg">
                            <span className="font-bold text-blue-300">{metrics.topCategory}</span> remains your dominant revenue driver.
                        </p>
                    </div>
                </div>

                {/* Section 3: Charts */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <span className="w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                            Financial Visualization
                        </h2>
                    </div>
                    <RevenueCharts data={graphs} />
                </section>

            </div>

            {/* Chat Overlay */}
            <ChatOverlay
                agentName="Revenue Insight Agent"
                apiEndpoint="/api/chat/revenue"
                suggestions={[
                    { title: "Summary Report", query: "Give me a summary report of the revenue." },
                    { title: "Revenue Trends", query: "How is the revenue trending this year?" },
                    { title: "Strategic Plan", query: "Give me a strategic plan to reach $1M in 6 months." },
                    { title: "What If Scenarios", query: "What if we increase marketing spend by 20%?" },
                    { title: "Past Strategy Review", query: "Did the past strategies work effectively?" },
                    { title: "General Q/A", query: "Tell me about the company's overall performance." }
                ]}
            />
        </div>
    );
}
