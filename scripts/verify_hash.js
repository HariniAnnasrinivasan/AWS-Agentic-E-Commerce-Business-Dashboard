
const bcrypt = require('bcrypt');

const password = "Admin@123";
const storedHash = "$2b$10$z8CsY0i4fJ0hq/gmYtxV1ux2qghP1yC1RQpIKeXn0Ct8cl8YjfW9C";

async function check() {
    const match = await bcrypt.compare(password, storedHash);
    console.log(`Password: ${password}`);
    console.log(`Stored Hash: ${storedHash}`);
    console.log(`Match? ${match}`);

    if (!match) {
        console.log("Generating NEW hash for 'Admin@123'...");
        const newHash = await bcrypt.hash(password, 10);
        console.log(`NEW HASH: ${newHash}`);
    }
}

check();
