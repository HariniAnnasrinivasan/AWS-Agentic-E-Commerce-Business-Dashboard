
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
        console.log("--- Distinct Sentiment Values ---");
        const sentiments = await client.query("SELECT DISTINCT sentiment FROM product_feedback");
        console.log(sentiments.rows);

        console.log("\n--- Daily Counts (First 20) ---");
        const daily = await client.query(`
        SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) 
        FROM product_feedback 
        GROUP BY date 
        ORDER BY date ASC 
        LIMIT 20
    `);
        console.log(daily.rows);

        console.log("\n--- Total Unique Days ---");
        const count = await client.query("SELECT COUNT(DISTINCT TO_CHAR(created_at, 'YYYY-MM-DD')) as c FROM product_feedback");
        console.log(count.rows[0]);

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
