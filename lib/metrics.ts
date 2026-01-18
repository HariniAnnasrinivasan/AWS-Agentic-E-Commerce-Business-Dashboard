import { query } from '@/lib/db';

export async function getKPIMetrics() {
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

    return {
        revenue: parseFloat(results[0].rows[0]?.total_revenue || '0'),
        orders: parseInt(results[1].rows[0]?.total_orders || '0'),
        customers: parseInt(results[2].rows[0]?.total_customers || '0'),
        refunds: parseInt(results[3].rows[0]?.total_refunds || '0'),
        cancellationRate: parseFloat(results[4].rows[0]?.cancellation_rate || '0'),
        averageOrderValue: parseFloat(results[5].rows[0]?.average_order_value || '0'),
        delayedDeliveries: parseInt(results[6].rows[0]?.total_delayed || '0'),
    };
}

export async function getGraphData() {
    const graphQueries = [
        query(`
      SELECT 
        TO_CHAR(order_date, 'YYYY-MM') as month, 
        SUM(total_amount) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE order_date IS NOT NULL
      GROUP BY TO_CHAR(order_date, 'YYYY-MM')
      ORDER BY month ASC
      LIMIT 12
    `),
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
        query(`
      SELECT 
        payment_status, 
        COUNT(*) as count
      FROM payments
      GROUP BY payment_status
    `),
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

    return {
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
}
