
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
    try {
        await client.connect();
        console.log('--- Deliveries Table ---');
        const res = await client.query("SELECT * FROM deliveries LIMIT 1");
        if (res.rows.length) console.log(Object.keys(res.rows[0]));

        console.log('--- Order Status History ---');
        const res2 = await client.query("SELECT * FROM order_status_history LIMIT 1");
        if (res2.rows.length) console.log(Object.keys(res2.rows[0]));

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
