const express = require('express');
const router = express.Router();
const pool = require("../db/connection");

router.post("/login", async (req,res) => {
    try {
        const {username,password} = req.body;

        const result = await pool.query(
            `
            SELECT * FROM users WHERE username = $1
            `,
            [username]
        );

        if(result.rows.length === 0){
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const user = result.rows[0];
        if(user.password_hash !== password){
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database Error" });
    }
});

module.exports = router;