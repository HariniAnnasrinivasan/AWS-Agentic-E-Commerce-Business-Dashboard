import {
    getOperationsMetrics,
    getOperationsGraphs,
    getCityInsights
} from '@/lib/metrics-operations';
import { OperationsCharts } from '@/components/operations/OperationsCharts';
import { ChatOverlay } from '@/components/ui/ChatOverlay';
import { KPICard } from '@/components/ui/KPICard';
import {
    Truck,
    Clock,
    AlertTriangle,
    XCircle,
    Timer,
    MapPin,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OperationsAgentPage() {
    const [metrics, graphs, insights] = await Promise.all([
        getOperationsMetrics(),
        getOperationsGraphs(),
        getCityInsights()
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
                        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 drop-shadow-sm flex items-center gap-4">
                            <Truck className="w-10 h-10 text-orange-400" />
                            Operations Efficiency Agent
                        </h1>
                        <p className="text-slate-300 font-medium text-lg tracking-wide ml-14">
                            Optimize logistics, reduce delays, and improve order fulfillment across cities.
                        </p>
                    </div>
                </div>

                {/* Section 1: KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
                    <KPICard
                        title="Delivery Delays"
                        value={metrics.deliveryDelays.toLocaleString()}
                        icon={Truck}
                        trendColor="text-rose-400"
                        trend="High Priority"
                    />
                    <KPICard
                        title="Processing Delays"
                        value={metrics.processingDelays.toLocaleString()}
                        icon={Clock}
                        trendColor="text-amber-400"
                    />
                    <KPICard
                        title="Payment Failures"
                        value={metrics.paymentFailures.toLocaleString()}
                        icon={AlertTriangle}
                        trendColor="text-rose-400"
                    />
                    <KPICard
                        title="Cancellations"
                        value={metrics.cancellations.toLocaleString()}
                        icon={XCircle}
                        trendColor="text-slate-400"
                    />
                    <KPICard
                        title="Avg Completion"
                        value={`${metrics.avgCompletionTime.toFixed(1)} Days`}
                        icon={Timer}
                        trendColor="text-blue-400"
                    />
                    <KPICard
                        title="Slowest City"
                        value={metrics.slowestCity}
                        icon={MapPin}
                        className="xl:col-span-1"
                        trendColor="text-rose-400"
                    />
                    <KPICard
                        title="Fastest City"
                        value={metrics.fastestCity}
                        icon={MapPin}
                        className="xl:col-span-1"
                        trendColor="text-emerald-400"
                    />
                </div>

                {/* Section 2: City Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-xl border border-rose-500/30 bg-rose-500/10 backdrop-blur-md">
                        <h3 className="text-rose-400 font-bold mb-2 uppercase text-xs tracking-wider">Most Delays</h3>
                        <p className="text-white text-lg font-medium">
                            {insights.mostDelaysCity}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">Requires immediate logistics review.</p>
                    </div>
                    <div className="p-6 rounded-xl border border-orange-500/30 bg-orange-500/10 backdrop-blur-md">
                        <h3 className="text-orange-400 font-bold mb-2 uppercase text-xs tracking-wider">Payment Issues</h3>
                        <p className="text-white text-lg font-medium">
                            {insights.mostFailuresCity}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">Check local payment gateways.</p>
                    </div>
                    <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
                        <h3 className="text-blue-400 font-bold mb-2 uppercase text-xs tracking-wider">Fastest Logistics</h3>
                        <p className="text-white text-lg font-medium">
                            {insights.fastestCities.join(', ')}
                        </p>
                        <p className="text-slate-400 text-sm mt-1">Model cities for best practices.</p>
                    </div>
                    <div className="p-6 rounded-xl border border-slate-500/30 bg-slate-500/10 backdrop-blur-md">
                        <h3 className="text-slate-300 font-bold mb-2 uppercase text-xs tracking-wider">Operations Summary</h3>
                        <p className="text-white text-sm">
                            <span className="text-rose-400 font-bold">{metrics.deliveryDelays}</span> delays significantly impact customer satisfaction. Focus on <b>{metrics.slowestCity}</b>.
                        </p>
                    </div>
                </div>

                {/* Section 3: Charts */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <span className="w-1 h-8 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
                            Operational Bottlenecks
                        </h2>
                    </div>
                    <OperationsCharts data={graphs} />
                </section>

            </div>

            {/* Chat Overlay */}
            <ChatOverlay
                agentName="Operations Efficiency Agent"
                apiEndpoint="/api/chat/operations"
                suggestions={[
                    { title: "Delay Analysis", query: "Analyze the causes of recent delivery delays." },
                    { title: "City Performance", query: "Which cities are facing the most operational bottlenecks?" },
                    { title: "Process Improvement", query: "How can we reduce average order completion time?" },
                    { title: "Payment Failures", query: "Why are payment failures high in specific regions?" },
                    { title: "Cancellation Reduction", query: "Give me a plan to reduce order cancellations." },
                    { title: "Resource Allocation", query: "Where should we allocate more logistics resources?" }
                ]}
            />
        </div>
    );
}
