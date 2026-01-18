
const { query } = require('../lib/db');

async function check() {
    try {
        console.log('--- Order Statuses ---');
        const res1 = await query("SELECT DISTINCT order_status FROM orders");
        console.log(res1.rows);

        console.log('\n--- Checking order_status_history ---');
        const res2 = await query("SELECT table_name FROM information_schema.tables WHERE table_name = 'order_status_history'");
        if (res2.rows.length > 0) {
            console.log('Table exists. Columns:');
            const res3 = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'order_status_history'");
            console.log(res3.rows);

            console.log('Sample Row:');
            const res4 = await query("SELECT * FROM order_status_history LIMIT 1");
            console.log(res4.rows);
        } else {
            console.log('Table order_status_history DOES NOT EXIST.');
        }

        console.log('\n--- Checking Cancellation Count ---');
        const res5 = await query("SELECT COUNT(*) FROM orders WHERE order_status = 'Cancelled'");
        console.log("Cancelled (Case Sensitive 'Cancelled'):", res5.rows[0]);
        const res6 = await query("SELECT COUNT(*) FROM orders WHERE order_status = 'CANCELLED'");
        console.log("Cancelled (Upper 'CANCELLED'):", res6.rows[0]);

    } catch (e) {
        console.error(e);
    }
}

check();
