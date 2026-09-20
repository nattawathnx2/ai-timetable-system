const express = require("express");
const router = express.Router();

const pool = require("../db/connection");

router.get("/", async (req,res) => {
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

router.post("/", async (req,res) => {
    try {
        const {
            subject_code,
            subject_name,
            credits,
            hours_per_week
        } = req.body;

        if(!subject_code || !subject_name || !credits || !hours_per_week){
            return res.status(400).json({
                error: "subject_code, subject_name and credits are required"
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

module.exports = router;