
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
    try {
        console.log("--- Sentiment Values ---");
        const sentiments = await client.query("SELECT DISTINCT sentiment FROM product_feedback");
        console.log(JSON.stringify(sentiments.rows));

        console.log("\n--- Hourly Counts (Top 10) ---");
        const hours = await client.query(`
        SELECT TO_CHAR(created_at, 'YYYY-MM-DD HH24') as h, COUNT(*) 
        FROM product_feedback 
        GROUP BY h
        ORDER BY h ASC 
        LIMIT 10
    `);
        console.log(hours.rows);

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
