
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
        console.log("--- Date Range ---");
        const range = await client.query("SELECT MIN(created_at), MAX(created_at) FROM product_feedback");
        console.log(range.rows[0]);

        console.log("\n--- Monthly Counts ---");
        const months = await client.query("SELECT TO_CHAR(created_at, 'YYYY-MM') as m, COUNT(*) FROM product_feedback GROUP BY m ORDER BY m");
        console.log(months.rows);

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
