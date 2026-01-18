import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Prevent caching for live data

export async function GET() {
    try {
        const kpiQueries = [
            // 1. Total Revenue (This Month)
            query(`
        SELECT COALESCE(SUM(total_amount), 0) as total_revenue
        FROM orders
        WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)
      `),

            // 2. Total Orders (This Month)
            query(`
        SELECT COUNT(*) as total_orders
        FROM orders
        WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)
      `),

            // 3. Total Customers
            query(`SELECT COUNT(*) as total_customers FROM customers`),

            // 4. Total Refund Requests
            query(`SELECT COUNT(*) as total_refunds FROM refunds`),

            // 5. Cancellation Rate
            query(`
        SELECT 
          CAST(
            (COUNT(CASE WHEN order_status = 'CANCELLED' THEN 1 END) * 100.0) / NULLIF(COUNT(*), 0) 
            AS NUMERIC(5,2)
          ) as cancellation_rate
        FROM orders
      `),

            // 6. Average Order Value
            query(`SELECT COALESCE(AVG(total_amount), 0) as average_order_value FROM orders`),

            // 7. Total Delayed Deliveries
            query(`
        SELECT COUNT(*) as total_delayed
        FROM deliveries
        WHERE (actual_delivery_date > expected_delivery_date) 
           OR (actual_delivery_date IS NULL AND expected_delivery_date < CURRENT_DATE)
      `)
        ];

        const results = await Promise.all(kpiQueries);

        const data = {
            revenue: parseFloat(results[0].rows[0]?.total_revenue || '0'),
            orders: parseInt(results[1].rows[0]?.total_orders || '0'),
            customers: parseInt(results[2].rows[0]?.total_customers || '0'),
            refunds: parseInt(results[3].rows[0]?.total_refunds || '0'),
            cancellationRate: parseFloat(results[4].rows[0]?.cancellation_rate || '0'),
            averageOrderValue: parseFloat(results[5].rows[0]?.average_order_value || '0'),
            delayedDeliveries: parseInt(results[6].rows[0]?.total_delayed || '0'),
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching KPI data:', error);
        return NextResponse.json({ error: 'Failed to fetch KPI data' }, { status: 500 });
    }
}
