import {
    getProductMetrics,
    getProductGraphs,
    getProductInsights
} from '@/lib/metrics-product';
import { ProductCharts } from '@/components/product/ProductCharts';
import { ChatOverlay } from '@/components/ui/ChatOverlay';
import { KPICard } from '@/components/ui/KPICard';
import {
    Package,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Layers,
    Tag,
    AlertTriangle,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProductAgentPage() {
    const [metrics, graphs, insights] = await Promise.all([
        getProductMetrics(),
        getProductGraphs(),
        getProductInsights()
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
                        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 drop-shadow-sm flex items-center gap-4">
                            <Package className="w-10 h-10 text-teal-400" />
                            Product Performance Agent
                        </h1>
                        <p className="text-slate-300 font-medium text-lg tracking-wide ml-14">
                            Track sales velocity, revenue leaders, and inventory health.
                        </p>
                    </div>
                </div>

                {/* Section 1: KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
                    <KPICard
                        title="Best Selling"
                        value={metrics.bestSelling}
                        icon={TrendingUp}
                        trendColor="text-teal-400"
                        className="xl:col-span-1"
                    />
                    <KPICard
                        title="Highest Revenue"
                        value={metrics.highestRevenue}
                        icon={DollarSign}
                        trendColor="text-emerald-400"
                        className="xl:col-span-1"
                    />
                    <KPICard
                        title="Top Category"
                        value={metrics.topCategory}
                        icon={Layers}
                        trendColor="text-blue-400"
                        className="xl:col-span-1"
                    />
                    <KPICard
                        title="Top Brand"
                        value={metrics.topBrand}
                        icon={Tag}
                        trendColor="text-purple-400"
                        className="xl:col-span-1"
                    />
                    <KPICard
                        title="Total Sold"
                        value={metrics.totalSold.toLocaleString()}
                        icon={Package}
                        trendColor="text-cyan-400"
                    />
                    <KPICard
                        title="Low Stock"
                        value={metrics.lowStockCount.toString()}
                        icon={AlertTriangle}
                        trendColor="text-red-400"
                    />
                    <KPICard
                        title="Least Selling"
                        value={metrics.leastSelling}
                        icon={TrendingDown}
                        trendColor="text-rose-400"
                        className="xl:col-span-1"
                    />
                </div>

                {/* Section 2: Insight Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl border border-teal-500/30 bg-teal-500/10 backdrop-blur-md">
                        <h3 className="text-teal-400 font-bold mb-2 uppercase text-xs tracking-wider">Fastest Growing Category</h3>
                        <p className="text-white text-lg">
                            <span className="font-bold text-teal-300">{insights.fastestGrowing}</span> is seeing the highest recent demand.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-md">
                        <h3 className="text-red-400 font-bold mb-2 uppercase text-xs tracking-wider">High Return Rate</h3>
                        <p className="text-white text-lg">
                            <span className="font-bold text-red-300">{insights.highestReturn}</span> has an unusually high refund rate.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl border border-orange-500/30 bg-orange-500/10 backdrop-blur-md">
                        <h3 className="text-orange-400 font-bold mb-2 uppercase text-xs tracking-wider">Customer Complaints</h3>
                        <p className="text-white text-lg">
                            <span className="font-bold text-orange-300">{insights.mostComplained}</span> faces the most negative feedback.
                        </p>
                    </div>
                </div>

                {/* Section 3: Charts */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <span className="w-1 h-8 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.8)]"></span>
                            Performance Visualizations
                        </h2>
                    </div>
                    <ProductCharts data={graphs} />
                </section>

            </div>

            {/* Chat Overlay */}
            <ChatOverlay
                agentName="Product Performance Agent"
                apiEndpoint="/api/chat/product"
                suggestions={[
                    { title: "Monthly Best", query: "Which category performed best this month?" },
                    { title: "Revenue Leader", query: "Which product is generating the highest revenue?" },
                    { title: "Inventory Check", query: "Which product has low inventory?" },
                    { title: "Weak Products", query: "Show me weak-performing products." },
                    { title: "Brand Analysis", query: "Compare sales between our top 2 brands." },
                    { title: "Restock Plan", query: "Suggest a restocking plan for low stock items." }
                ]}
            />
        </div>
    );
}
