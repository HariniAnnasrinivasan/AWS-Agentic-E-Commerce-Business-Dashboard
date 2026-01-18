
const { Client } = require('pg');
const bcrypt = require('bcrypt');

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
        const password = "Admin@123";
        const newHash = await bcrypt.hash(password, 10);
        console.log(`Setting new hash for 'admin': ${newHash}`);

        await client.query("UPDATE admin_users SET password_hash = $1 WHERE username = 'admin'", [newHash]);
        console.log("Update successful.");

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}
run();
