const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ai_timetable",
    password: "181920",
    port: 5432,
});

module.exports = pool;