
const { Client } = require('pg');
const client = new Client({
    host: 'jarbis-postgres-db-2.ct8s8cg26mzr.us-east-2.rds.amazonaws.com',
    user: 'jarbis_admin',
    password: 'JarvBiz2812',
    database: 'postgres',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    await client.connect();
    console.log("Connected");
    try {
        // 1. Total Reviews
        console.log("Test 1: Total Reviews");
        await client.query(`SELECT COUNT(*) as value FROM product_feedback`);

        // 2. Avg Rating
        console.log("Test 2: Avg Rating");
        await client.query(`SELECT AVG(rating) as value FROM product_feedback`);

        // 3. Common Complaint (Complex one)
        console.log("Test 3: Common Complaint");
        await client.query(`
        SELECT 
            CASE 
                WHEN comment ILIKE '%delivery%' OR comment ILIKE '%late%' THEN 'Delivery Issue'
                WHEN comment ILIKE '%quality%' OR comment ILIKE '%broke%' OR comment ILIKE '%damage%' THEN 'Quality Issue'
                WHEN comment ILIKE '%size%' OR comment ILIKE '%fit%' THEN 'Sizing Issue'
                WHEN comment ILIKE '%fake%' OR comment ILIKE '%authentic%' THEN 'Authenticity'
                WHEN comment ILIKE '%price%' OR comment ILIKE '%expensive%' THEN 'Pricing'
                ELSE 'Other'
            END as type,
            COUNT(*) as cnt
        FROM product_feedback
        WHERE sentiment = 'Negative' OR rating <= 2
        GROUP BY type
        ORDER BY cnt DESC
        LIMIT 1
    `);

        // 4. Graphs - Sentiment Trend
        console.log("Test 4: Sentiment Trend");
        await client.query(`
        SELECT TO_CHAR(created_at, 'YYYY-MM') as month,
               sentiment,
               COUNT(*) as cnt
        FROM product_feedback
        GROUP BY month, sentiment
        ORDER BY month ASC
    `);

        console.log("ALL TESTS PASSED");

    } catch (e) {
        console.error("SQL Error:", e.message);
    } finally {
        await client.end();
    }
}
run();
