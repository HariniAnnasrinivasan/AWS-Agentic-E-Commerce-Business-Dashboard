import { query } from '@/lib/db';

export async function getOperationsMetrics() {
  const queries = [
    // 1. Total Delivery Delays
    query(`
      SELECT COUNT(*) as value 
      FROM deliveries 
      WHERE (actual_delivery_date > expected_delivery_date) 
         OR (actual_delivery_date IS NULL AND expected_delivery_date < CURRENT_DATE)
    `),

    // 2. Total Processing Delays (Historical: > 2 days to Ship)
    query(`
      WITH transitions AS (
          SELECT h.order_id, h.changed_at, LAG(h.changed_at) OVER (PARTITION BY h.order_id ORDER BY h.changed_at) as prev_changed_at
          FROM order_status_history h
      )
      SELECT COUNT(*) as value
      FROM transitions
      WHERE prev_changed_at IS NOT NULL
      AND AGE(changed_at, prev_changed_at) > INTERVAL '1 day'
    `),

    // 3. Total Payment Failures
    query(`SELECT COUNT(*) as value FROM payments WHERE UPPER(payment_status) = 'FAILED'`),

    // 4. Total Cancellations
    query(`SELECT COUNT(*) as value FROM orders WHERE UPPER(order_status) = 'CANCELLED'`),

    // 5. Avg Order Completion Time (Days)
    query(`
      SELECT AVG(EXTRACT(DAY FROM AGE(d.actual_delivery_date, o.order_date))) as value
      FROM deliveries d
      JOIN orders o ON d.order_id = o.order_id
      WHERE d.actual_delivery_date IS NOT NULL
    `),

    // 6. Slowest City (Max Average Delivery Time)
    query(`
      SELECT c.city as name, AVG(EXTRACT(DAY FROM AGE(d.actual_delivery_date, o.order_date))) as avg_days
      FROM deliveries d
      JOIN orders o ON d.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      WHERE d.actual_delivery_date IS NOT NULL
      GROUP BY c.city
      ORDER BY avg_days DESC
      LIMIT 1
    `),

    // 7. Fastest City
    query(`
      SELECT c.city as name, AVG(EXTRACT(DAY FROM AGE(d.actual_delivery_date, o.order_date))) as avg_days
      FROM deliveries d
      JOIN orders o ON d.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      WHERE d.actual_delivery_date IS NOT NULL
      GROUP BY c.city
      ORDER BY avg_days ASC
      LIMIT 1
    `)
  ];

  const results = await Promise.all(queries);

  return {
    deliveryDelays: parseInt(results[0].rows[0]?.value || '0'),
    processingDelays: parseInt(results[1].rows[0]?.value || '0'),
    paymentFailures: parseInt(results[2].rows[0]?.value || '0'),
    cancellations: parseInt(results[3].rows[0]?.value || '0'),
    avgCompletionTime: parseFloat(results[4].rows[0]?.value || '0'),
    slowestCity: results[5].rows[0]?.name || 'N/A',
    fastestCity: results[6].rows[0]?.name || 'N/A'
  };
}

export async function getOperationsGraphs() {
  const queries = [
    // 1. Delivery Delays by City
    query(`
      SELECT c.city, COUNT(*) as delayed_count
      FROM deliveries d
      JOIN orders o ON d.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      WHERE (d.actual_delivery_date > d.expected_delivery_date) 
         OR (d.actual_delivery_date IS NULL AND d.expected_delivery_date < CURRENT_DATE)
      GROUP BY c.city
      ORDER BY delayed_count DESC
      LIMIT 10
    `),

    // 2. Order Processing Delays by City (Historical)
    query(`
      WITH transitions AS (
          SELECT h.order_id, h.changed_at, LAG(h.changed_at) OVER (PARTITION BY h.order_id ORDER BY h.changed_at) as prev_changed_at
          FROM order_status_history h
      ),
      delayed_transitions AS (
          SELECT order_id
          FROM transitions
          WHERE prev_changed_at IS NOT NULL
          AND AGE(changed_at, prev_changed_at) > INTERVAL '1 day'
      )
      SELECT c.city, COUNT(*) as delayed_count
      FROM delayed_transitions dt
      JOIN orders o ON dt.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      GROUP BY c.city
      ORDER BY delayed_count DESC
      LIMIT 10
    `),

    // 3. Payment Failure Rate by City
    query(`
      SELECT c.city, 
        COUNT(CASE WHEN UPPER(p.payment_status) = 'FAILED' THEN 1 END) * 100.0 / COUNT(*) as failure_rate
      FROM payments p
      JOIN orders o ON p.order_id = o.order_id
      JOIN customers c ON o.customer_id = c.customer_id
      GROUP BY c.city
      ORDER BY failure_rate DESC
      LIMIT 10
    `),

    // 4. Cancellation Rate by City
    query(`
      SELECT c.city,
        COUNT(CASE WHEN UPPER(o.order_status) = 'CANCELLED' THEN 1 END) * 100.0 / COUNT(*) as cancellation_rate
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      GROUP BY c.city
      ORDER BY cancellation_rate DESC
      LIMIT 10
    `),

    // 5. Avg Completion Time by Month
    query(`
      SELECT TO_CHAR(o.order_date, 'YYYY-MM') as month, 
             AVG(EXTRACT(DAY FROM AGE(d.actual_delivery_date, o.order_date))) as avg_days
      FROM deliveries d
      JOIN orders o ON d.order_id = o.order_id
      WHERE d.actual_delivery_date IS NOT NULL
      GROUP BY month
      ORDER BY month ASC
      LIMIT 12
    `)
  ];

  const results = await Promise.all(queries);

  return {
    delaysByCity: results[0].rows.map(r => ({ city: r.city, value: parseInt(r.delayed_count) })),
    processingDelaysByCity: results[1].rows.map(r => ({ city: r.city, value: parseInt(r.delayed_count) })),
    paymentFailureByCity: results[2].rows.map(r => ({ city: r.city, value: parseFloat(r.failure_rate) })),
    cancellationByCity: results[3].rows.map(r => ({ city: r.city, value: parseFloat(r.cancellation_rate) })),
    completionTimeTrend: results[4].rows.map(r => ({ month: r.month, value: parseFloat(r.avg_days) }))
  };
}

export async function getCityInsights() {
  const [slowest, fastest, mostDelays, mostFailures] = await Promise.all([
    query(`
            SELECT c.city, AVG(EXTRACT(DAY FROM AGE(d.actual_delivery_date, o.order_date))) as val
            FROM deliveries d JOIN orders o ON d.order_id = o.order_id JOIN customers c ON o.customer_id = c.customer_id
            WHERE d.actual_delivery_date IS NOT NULL GROUP BY c.city ORDER BY val DESC LIMIT 3
        `),
    query(`
            SELECT c.city, AVG(EXTRACT(DAY FROM AGE(d.actual_delivery_date, o.order_date))) as val
            FROM deliveries d JOIN orders o ON d.order_id = o.order_id JOIN customers c ON o.customer_id = c.customer_id
            WHERE d.actual_delivery_date IS NOT NULL GROUP BY c.city ORDER BY val ASC LIMIT 3
        `),
    query(`
            SELECT c.city, COUNT(*) as val
            FROM deliveries d JOIN orders o ON d.order_id = o.order_id JOIN customers c ON o.customer_id = c.customer_id
            WHERE (d.actual_delivery_date > d.expected_delivery_date) OR (d.actual_delivery_date IS NULL AND d.expected_delivery_date < CURRENT_DATE)
            GROUP BY c.city ORDER BY val DESC LIMIT 1
        `),
    query(`
            SELECT c.city, COUNT(*) as val
            FROM payments p JOIN orders o ON p.order_id = o.order_id JOIN customers c ON o.customer_id = c.customer_id
            WHERE UPPER(p.payment_status) = 'FAILED' GROUP BY c.city ORDER BY val DESC LIMIT 1
        `)
  ]);

  return {
    slowestCities: slowest.rows.map(r => r.city),
    fastestCities: fastest.rows.map(r => r.city),
    mostDelaysCity: mostDelays.rows[0]?.city || 'N/A',
    mostFailuresCity: mostFailures.rows[0]?.city || 'N/A'
  };
}
