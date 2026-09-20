const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.get("/", async (req,res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM schedules ORDER BY schedule_id"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database Error" });
    }
});

router.post("/", async (req,res) => {
    try {
        const {
            day_of_week,
            start_time,
            end_time,
            teacher_id,
            subject_id,
            room_id,
            group_id
        } = req.body;

        if(!day_of_week || !start_time || !end_time || !teacher_id || !subject_id || !room_id || !group_id){
            return res.status(400).json({
                error: "The information received is incomplete!"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO schedules
            (day_of_week, start_time, end_time, teacher_id, subject_id, room_id, group_id)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
            `,
            [
                day_of_week,
                start_time,
                end_time,
                teacher_id,
                subject_id,
                room_id,
                group_id
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database Error" });
    }
});

module.exports = router;