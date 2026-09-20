const express = require("express");
const router = express.Router();

const pool = require("../db/connection");

router.get("/", async (req,res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM rooms ORDER BY room_id"
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
            room_code,
            room_name,
            room_type
        } = req.body;

        if(!room_code || !room_name || !room_type){
            return res.status(400).json({
                error: "room_code, room_name and room_type are required"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO rooms
            (room_code, room_name, room_type)
            VALUES ($1,$2,$3)
            RETURNING *
            `,
            [
                room_code,
                room_name,
                room_type
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