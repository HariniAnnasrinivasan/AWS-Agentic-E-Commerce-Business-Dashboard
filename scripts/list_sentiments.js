
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
        const res = await client.query("SELECT DISTINCT sentiment FROM product_feedback");
        console.log(res.rows.map(r => r.sentiment).join('\n'));
    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
