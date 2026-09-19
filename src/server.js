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

app.get("/subjects", async (req,res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM subjects ORDER BY subject_id"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database Error"
        });
    }
});

app.post("/teachers", async (req,res) => {
    try {
        const {
            teacher_code,
            first_name,
            last_name,
            department
        } = req.body;

        if(!teacher_code || !first_name || !last_name){
            return res.status(400).json({
                error: "teacher_code, first_name and last_name are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO teachers
            (teacher_code, first_name, last_name, department)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                teacher_code,
                first_name,
                last_name,
                department
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database Error"
        });
    }
});

app.post("/subjects", async (req,res) => {
    try {
        const {
            subject_code,
            subject_name,
            credits,
            hours_per_week
        } = req.body;
        
        if(!subject_code || !subject_name || !credits || !hours_per_week){
            return res.status(400).json({
                error: "subject_code, subject_name, credits and hours_per_week are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO subjects
            (subject_code, subject_name, credits, hours_per_week)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                subject_code,
                subject_name,
                credits,
                hours_per_week
            ]
        );
        res.status(201).json(result.rows[0]);
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