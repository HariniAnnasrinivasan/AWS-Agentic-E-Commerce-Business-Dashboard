
const fs = require('fs');
try {
    const raw = fs.readFileSync('debug_output.json', 'utf16le'); // Read as UTF-16LE
    const data = JSON.parse(raw);
    console.log('Statuses:', data.statuses.map(s => s.order_status));
    console.log('Has History Table:', data.hasHistoryTable);
    console.log('Count Cancelled:', data.countCancelled);
    console.log('Count CANCELLED:', data.countCANCELLED);
} catch (e) {
    console.log('Error reading JSON:', e.message);
    // Try reading as utf8 in case
    try {
        const raw = fs.readFileSync('debug_output.json', 'utf8');
        const data = JSON.parse(raw);
        console.log('Statuses:', data.statuses.map(s => s.order_status));
        console.log('Has History Table:', data.hasHistoryTable);
        console.log('Count Cancelled:', data.countCancelled);
        console.log('Count CANCELLED:', data.countCANCELLED);
    } catch (e2) {
        console.log('Error reading JSON utf8:', e2.message);
    }
}
