
const fs = require('fs');
try {
    const raw = fs.readFileSync('diagnose_full.json', 'utf8');
    const data = JSON.parse(raw);
    console.log('--- History Columns ---');
    console.log(data.historyCols);
    console.log('--- Order Columns ---');
    console.log(data.orderCols);
    console.log('--- Status Counts ---');
    console.log(data.statusCounts);
} catch (e) {
    console.log(e.message);
}
