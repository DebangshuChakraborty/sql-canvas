const db = require('./backend/db');

async function test() {
  await db.connect({
    host: 'localhost',
    port: '1522',
    username: 'system',
    password: 'system',
    serviceName: 'XE'
  });

  try {
    const q1 = "SELECT * FROM std;";
    console.log("Running:", q1);
    const r1 = await db.runQuery(q1);
    console.log("Success:", r1.rows.length, "rows");
  } catch(e) {
    console.error("Failed q1:", e.message);
  }

  try {
    const q2 = "SELECT * FROM std";
    console.log("Running:", q2);
    const r2 = await db.runQuery(q2);
    console.log("Success:", r2.rows.length, "rows");
  } catch(e) {
    console.error("Failed q2:", e.message);
  }

  await db.disconnect();
}

test();
