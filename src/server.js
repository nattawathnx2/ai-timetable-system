const express = require('express');
const app = express();
const pool = require("./db/connection");
app.use(express.json());

app.get("/", (req,res) => {
    res.json({
        project: "AI Timetable System",
        status: "running"
    })
});

app.get("/teachers", async (req,res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM teachers ORDER BY teacher_id"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database Error"
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server runnning at port ${PORT}`);
});