const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.get("/", async (req,res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM student_groups ORDER BY group_id"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database Error "});
    }
});

router.post("/",async (req,res) => {
    try {
        const {
            group_code,
            group_name,
            academic_year,
            student_count
        } = req.body;

        if(!group_code || !group_name || !academic_year || !student_count){
            return res.status(400).json({ error: "group_code, group_name, academic_year and student_count are required" });
        }

        const result = await pool.query(
            `
            INSERT INTO student_groups
            (group_code, group_name, academic_year, student_count)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                group_code,
                group_name,
                academic_year,
                student_count
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database Error" });
    }
});

module.exports = router;