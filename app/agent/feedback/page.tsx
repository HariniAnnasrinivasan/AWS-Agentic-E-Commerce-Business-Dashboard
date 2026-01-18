import {
    getFeedbackMetrics,
    getFeedbackGraphs,
    getFeedbackInsights
} from '@/lib/metrics-feedback';
import { FeedbackCharts } from '@/components/feedback/FeedbackCharts';
import { ChatOverlay } from '@/components/ui/ChatOverlay';
import { KPICard } from '@/components/ui/KPICard';
import {
    MessageSquare,
    Star,
    ThumbsUp,
    ThumbsDown,
    Award,
    AlertTriangle,
    ArrowLeft,
    TrendingDown
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FeedbackAgentPage() {
    const [metrics, graphs, insights] = await Promise.all([
        getFeedbackMetrics(),
        getFeedbackGraphs(),
        getFeedbackInsights()
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
                        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-sm flex items-center gap-4">
                            <MessageSquare className="w-10 h-10 text-purple-400" />
                            Feedback Intelligence Agent
                        </h1>
                        <p className="text-slate-300 font-medium text-lg tracking-wide ml-14">
                            Analyze customer sentiment, product ratings, and critical feedback issues.
                        </p>
                    </div>
                </div>

                {/* Section 1: KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
                    <KPICard
                        title="Total Reviews"
                        value={metrics.totalReviews.toLocaleString()}
                        icon={MessageSquare}
                        trendColor="text-purple-400"
                    />
                    <KPICard
                        title="Avg Rating"
                        value={metrics.avgRating.toFixed(1)}
                        icon={Star}
                        trendColor="text-yellow-400"
                    />
                    <KPICard
                        title="Positive"
                        value={metrics.positiveCount.toLocaleString()}
                        icon={ThumbsUp}
                        trendColor="text-emerald-400"
                    />
                    <KPICard
                        title="Negative"
                        value={metrics.negativeCount.toLocaleString()}
                        icon={ThumbsDown}
                        trendColor="text-red-400"
                    />
                    <KPICard
                        title="Highest Rated"
                        value={metrics.highestRated}
                        icon={Award}
                        className="xl:col-span-1"
                        trendColor="text-emerald-400"
                    />
                    <KPICard
                        title="Lowest Rated"
                        value={metrics.lowestRated}
                        icon={TrendingDown}
                        className="xl:col-span-1"
                        trendColor="text-red-400"
                    />
                    <KPICard
                        title="Top Complaint"
                        value={metrics.commonComplaint}
                        icon={AlertTriangle}
                        className="xl:col-span-1"
                        trendColor="text-orange-400"
                    />
                </div>

                {/* Section 2: Insight Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
                        <h3 className="text-purple-400 font-bold mb-2 uppercase text-xs tracking-wider">Sentiment Overview</h3>
                        <p className="text-white text-lg">
                            {insights.summary}
                        </p>
                    </div>
                    <div className="p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-md">
                        <h3 className="text-yellow-400 font-bold mb-2 uppercase text-xs tracking-wider">Quality Champion</h3>
                        <p className="text-white text-lg">
                            <span className="font-bold text-yellow-300">{metrics.highestRated}</span> is a customer favorite.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-md">
                        <h3 className="text-red-400 font-bold mb-2 uppercase text-xs tracking-wider">Critical Focus</h3>
                        <p className="text-white text-lg">
                            Reviews for <span className="font-bold text-red-300">{metrics.lowestRated}</span> indicate urgent quality control issues.
                        </p>
                    </div>
                </div>

                {/* Section 3: Charts */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <span className="w-1 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
                            Feedback Visualization
                        </h2>
                    </div>
                    <FeedbackCharts data={graphs} />
                </section>

            </div>

            {/* Chat Overlay */}
            <ChatOverlay
                agentName="Feedback Intelligence Agent"
                apiEndpoint="/api/chat/feedback"
                suggestions={[
                    { title: "Sentiment Analysis", query: "What is the overall sentiment trend?" },
                    { title: "Product Defects", query: "Why is the lowest rated product failing?" },
                    { title: "Customer Wishes", query: "What features are customers asking for?" },
                    { title: "Complaint Summary", query: "Summarize the top complaints this month." },
                    { title: "Category Report", query: "Which category has the worst feedback?" },
                    { title: "Improvement Plan", query: "Suggest improvements based on negative reviews." }
                ]}
            />
        </div>
    );
}
