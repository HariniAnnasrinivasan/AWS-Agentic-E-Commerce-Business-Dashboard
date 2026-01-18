
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
        const res = await client.query("SELECT * FROM product_feedback LIMIT 1");
        if (res.rows.length > 0) {
            console.log("KEYS:", JSON.stringify(Object.keys(res.rows[0])));
        } else {
            const schema = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'product_feedback'");
            console.log("SCHEMA:", JSON.stringify(schema.rows.map(r => r.column_name)));
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
