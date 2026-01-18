import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const graphQueries = [
            // 1. Revenue & Orders Trend (Combined for efficiency but can be split)
            query(`
        SELECT 
          TO_CHAR(order_date, 'YYYY-MM') as month, 
          SUM(total_amount) as revenue,
          COUNT(*) as orders
        FROM orders
        WHERE order_date IS NOT NULL
        GROUP BY TO_CHAR(order_date, 'YYYY-MM')
        ORDER BY month ASC
        LIMIT 12 -- Last 12 months for cleanliness
      `),

            // 2. Category-wise Sales
            query(`
        SELECT 
          p.category, 
          SUM(oi.quantity * oi.price) as sales
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        GROUP BY p.category
        ORDER BY sales DESC
        LIMIT 10
      `),

            // 3. Payment Status Breakdown
            query(`
        SELECT 
          payment_status, 
          COUNT(*) as count
        FROM payments
        GROUP BY payment_status
      `),

            // 4. Delivery Delays Trend
            query(`
        SELECT 
          TO_CHAR(expected_delivery_date, 'YYYY-MM') as month, 
          COUNT(*) as delayed_count
        FROM deliveries
        WHERE (actual_delivery_date > expected_delivery_date) 
           OR (actual_delivery_date IS NULL AND expected_delivery_date < CURRENT_DATE)
        GROUP BY TO_CHAR(expected_delivery_date, 'YYYY-MM')
        ORDER BY month ASC
        LIMIT 12
      `)
        ];

        const results = await Promise.all(graphQueries);

        const data = {
            revenueTrend: results[0].rows.map(row => ({
                month: row.month,
                revenue: parseFloat(row.revenue),
                orders: parseInt(row.orders),
            })),
            categorySales: results[1].rows.map(row => ({
                category: row.category,
                sales: parseFloat(row.sales),
            })),
            paymentStatus: results[2].rows.map(row => ({
                status: row.payment_status,
                count: parseInt(row.count),
            })),
            deliveryDelays: results[3].rows.map(row => ({
                month: row.month,
                delayed: parseInt(row.delayed_count),
            })),
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching graph data:', error);
        return NextResponse.json({ error: 'Failed to fetch graph data' }, { status: 500 });
    }
}
