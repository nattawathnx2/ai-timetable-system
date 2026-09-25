const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.get("/", async (req,res) => {
    try {
        const result = await pool.query(
            `
            SELECT 
                s.schedule_id, s.day_of_week, s.start_time, s.end_time,
                s.teacher_id, s.subject_id, s.room_id, s.group_id,                
                t.teacher_code, t.first_name, t.last_name,
                sub.subject_name,
                r.room_name,
                g.group_name
            FROM schedules s
            JOIN teachers t
                ON s.teacher_id = t.teacher_id
            JOIN subjects sub
                ON s.subject_id = sub.subject_id
            JOIN rooms r
                ON s.room_id = r.room_id
            JOIN student_groups g
                ON s.group_id = g.group_id
            ORDER BY s.schedule_id;
            `
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
            `
            SELECT 
                s.schedule_id, s.day_of_week, s.start_time, s.end_time,
                s.teacher_id, s.subject_id, s.room_id, s.group_id,
                t.teacher_code, t.first_name, t.last_name,
                sub.subject_name,
                r.room_name,
                g.group_name
            FROM schedules s
            JOIN teachers t
                ON s.teacher_id = t.teacher_id
            JOIN subjects sub
                ON s.subject_id = sub.subject_id
            JOIN rooms r
                ON s.room_id = r.room_id
            JOIN student_groups g
                ON s.group_id = g.group_id
            WHERE s.schedule_id = $1
            `,[req.params.id]
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