import { query } from '@/lib/db';

export async function getRevenueMetrics() {
    const queries = [
        // 1. Total Revenue (All-time)
        query(`SELECT COALESCE(SUM(total_amount), 0) as value FROM orders`),

        // 2. Total Revenue (This Month)
        query(`
      SELECT COALESCE(SUM(total_amount), 0) as value 
      FROM orders 
      WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)
    `),

        // 3. Average Order Value (All-time)
        query(`SELECT COALESCE(AVG(total_amount), 0) as value FROM orders`),

        // 4. Number of Paying Customers
        query(`
      SELECT COUNT(DISTINCT customer_id) as value 
      FROM orders 
      WHERE total_amount > 0
    `),

        // 5. Highest Revenue Category
        query(`
      SELECT p.category as name, SUM(oi.quantity * oi.price) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.category
      ORDER BY revenue DESC
      LIMIT 1
    `),

        // 6. Highest Revenue Product
        query(`
      SELECT p.name, SUM(oi.quantity * oi.price) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.name
      ORDER BY revenue DESC
      LIMIT 1
    `)
    ];

    const results = await Promise.all(queries);

    return {
        totalRevenue: parseFloat(results[0].rows[0]?.value || '0'),
        monthRevenue: parseFloat(results[1].rows[0]?.value || '0'),
        avgOrderValue: parseFloat(results[2].rows[0]?.value || '0'),
        payingCustomers: parseInt(results[3].rows[0]?.value || '0'),
        topCategory: results[4].rows[0]?.name || 'N/A',
        topProduct: results[5].rows[0]?.name || 'N/A',
        topProductRevenue: parseFloat(results[5].rows[0]?.revenue || '0'), // For context if needed
    };
}

export async function getRevenueGraphs() {
    const queries = [
        // 1. Revenue Trend Over Time
        query(`
      SELECT TO_CHAR(order_date, 'YYYY-MM') as month, SUM(total_amount) as revenue
      FROM orders
      WHERE order_date IS NOT NULL
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12
    `),

        // 2. Revenue by Product Category
        query(`
      SELECT p.category, SUM(oi.quantity * oi.price) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.category
      ORDER BY revenue DESC
    `),

        // 3. Revenue by Brand
        query(`
      SELECT p.brand, SUM(oi.quantity * oi.price) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.brand
      ORDER BY revenue DESC
      LIMIT 8
    `),

        // 4. AOV Trend (Average Order Value)
        query(`
      SELECT TO_CHAR(order_date, 'YYYY-MM') as month, AVG(total_amount) as aov
      FROM orders
      WHERE order_date IS NOT NULL
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12
    `),

        // 5. Payment Mode Split
        query(`
      SELECT payment_mode, SUM(total_amount) as revenue
      FROM orders
      WHERE payment_mode IS NOT NULL
      GROUP BY payment_mode
    `)
    ];

    const results = await Promise.all(queries);

    return {
        revenueTrend: results[0].rows.map(r => ({ month: r.month, revenue: parseFloat(r.revenue) })),
        categoryRevenue: results[1].rows.map(r => ({ category: r.category, revenue: parseFloat(r.revenue) })),
        brandRevenue: results[2].rows.map(r => ({ brand: r.brand, revenue: parseFloat(r.revenue) })),
        aovTrend: results[3].rows.map(r => ({ month: r.month, aov: parseFloat(r.aov) })),
        paymentSplit: results[4].rows.map(r => ({ mode: r.payment_mode, revenue: parseFloat(r.revenue) })),
    };
}

export async function getRevenueInsights() {
    // Computed on the fly using the graph data logic to avoid re-fetching or complex SQL for simple text
    const [peakMonthRes, lowestMonthRes] = await Promise.all([
        query(`
            SELECT TO_CHAR(order_date, 'YYYY-MM') as month, SUM(total_amount) as revenue
            FROM orders GROUP BY month ORDER BY revenue DESC LIMIT 1
         `),
        query(`
            SELECT TO_CHAR(order_date, 'YYYY-MM') as month, SUM(total_amount) as revenue
            FROM orders GROUP BY month ORDER BY revenue ASC LIMIT 1
         `)
    ]);

    return {
        peakMonth: peakMonthRes.rows[0]?.month || 'N/A',
        peakRevenue: parseFloat(peakMonthRes.rows[0]?.revenue || '0'),
        lowestMonth: lowestMonthRes.rows[0]?.month || 'N/A',
    };
}
