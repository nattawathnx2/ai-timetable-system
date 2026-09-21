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

router.get("/:id", async (req,res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM schedules WHERE schedule_id = $1",[req.params.id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({ error: "Schedules not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database Error" });
    }
});

router.delete("/:id", async (req,res) => {
    try {
        const result = await pool.query(
            `
            DELETE FROM schedules
            WHERE schedule_id = $1
            RETURNING *
            `, [req.params.id]
        );
        if(result.rows.length === 0){
            return res.status(404).json({ error: "Schedules not found" });
        }
        res.json(result.rows[0]);
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

router.put("/:id", async (req,res) => {
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
            UPDATE schedules
            SET 
                day_of_week = $1,
                start_time = $2,
                end_time = $3,
                teacher_id = $4,
                subject_id = $5,
                room_id = $6,
                group_id = $7
            WHERE schedule_id = $8
            RETURNING *
            `, [day_of_week, start_time, end_time, teacher_id, subject_id, room_id, group_id, req.params.id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({ error: "Schedules not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database Error" });
    }
});

module.exports = router;