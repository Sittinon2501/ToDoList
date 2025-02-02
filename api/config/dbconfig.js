// connectdb.js
const sql = require("mssql");

const dbConfig = {
  user: "sa",
  password: "Dbfored1",
  server: "NOOBMASTER",
  database: "Task",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};


const connectDB = async () => {
  try {
    const pool = await sql.connect(dbConfig); 
    console.log("เชื่อมต่อกับฐานข้อมูลสำเร็จ");
    return pool; 
  } catch (err) {
    console.error("การเชื่อมต่อฐานข้อมูลล้มเหลว:", err);
    throw err; 
  }
};
module.exports = { connectDB, sql };
