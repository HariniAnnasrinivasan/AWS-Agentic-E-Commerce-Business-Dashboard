import { getKPIMetrics, getGraphData } from '@/lib/metrics';
import { KPICard } from '@/components/ui/KPICard';
import { NavigationCards } from '@/components/dashboard/NavigationCards';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import {
  DollarSign,
  ShoppingCart,
  Users,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { LogoutButton } from '@/components/ui/LogoutButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [kpi, graphs] = await Promise.all([
    getKPIMetrics(),
    getGraphData()
  ]);

  return (
    // REMOVED bg-slate-50. Using transparent to let global gradient show.
    <div className="min-h-screen p-6 md:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-12">



        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm">
              Business Analytics Overview
            </h1>
            <p className="text-slate-300 font-medium text-lg tracking-wide">
              Real-time e-commerce performance & agent intelligence.
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Section 1: Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
          <KPICard
            title="Total Revenue"
            value={`$${kpi.revenue.toLocaleString()}`}
            icon={DollarSign}
            trend="+12% GROWTH"
            trendColor="text-emerald-400"
          />
          <KPICard
            title="Total Orders"
            value={kpi.orders.toLocaleString()}
            icon={ShoppingCart}
            trendColor="text-slate-400"
            trend="THIS MONTH"
          />
          <KPICard
            title="Total Customers"
            value={kpi.customers.toLocaleString()}
            icon={Users}
            trendColor="text-blue-400"
            trend="ACTIVE USER BASE"
          />
          <KPICard
            title="Refund Requests"
            value={kpi.refunds.toLocaleString()}
            icon={RotateCcw}
            trendColor="text-rose-400"
            trend="REQUIRES ATTENTION"
          />
          <KPICard
            title="Cancellations"
            value={`${kpi.cancellationRate}%`}
            icon={AlertTriangle}
            trendColor="text-rose-400"
            trend="HIGH RATE"
          />
          <KPICard
            title="Avg Order Value"
            value={`$${kpi.averageOrderValue.toFixed(2)}`}
            icon={TrendingUp}
            trendColor="text-indigo-400"
            trend="+5% INCREASE"
          />
          <KPICard
            title="Delayed Deliveries"
            value={kpi.delayedDeliveries.toLocaleString()}
            icon={Clock}
            trendColor="text-amber-400"
            trend="CHECK LOGISTICS"
          />
        </div>

        {/* Section 2: Navigation Cards */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              Agent Modules
            </h2>
          </div>
          <NavigationCards />
        </section>

        {/* Section 3: Core Business Graphs */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="w-1 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
              Performance Trends
            </h2>
          </div>
          <DashboardCharts data={graphs} />
        </section>

      </div>
    </div>
  );
}
