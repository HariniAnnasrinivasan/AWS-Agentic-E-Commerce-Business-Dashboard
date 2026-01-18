
const { query } = require('../lib/db');

async function diagnose() {
    try {
        console.log('--- Order Status Distribution ---');
        const res1 = await query("SELECT order_status, COUNT(*) FROM orders GROUP BY order_status");
        console.log(res1.rows);

        console.log('\n--- Orders Table Columns ---');
        const res2 = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'");
        console.log(res2.rows.map(r => r.column_name));

        console.log('\n--- Order Status History Table Columns ---');
        const res3 = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'order_status_history'");
        console.log(res3.rows.map(r => r.column_name));

    } catch (e) {
        console.error(e);
    }
}

diagnose();
