
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
        console.log("Test Join 1: Highest Rated");
        await client.query(`
        SELECT p.product_name as name, AVG(f.rating) as val
        FROM product_feedback f JOIN products p ON f.product_id = p.product_id
        GROUP BY p.product_name ORDER BY val DESC LIMIT 1
    `);

        console.log("Test Join 2: Category Stats");
        await client.query(`
        SELECT p.category, COUNT(*) as cnt
        FROM product_feedback f
        JOIN products p ON f.product_id = p.product_id
        WHERE f.sentiment = 'Negative' OR f.rating <= 2
        GROUP BY p.category
        ORDER BY cnt DESC
        LIMIT 10
    `);

        console.log("JOIN TESTS PASSED");

    } catch (e) {
        console.error("SQL Error:", e.message);
    } finally {
        await client.end();
    }
}
run();
