const express = require('express');
const app = express();
app.use(express.json());

app.get("/", (req,res) => {
    res.json({
        project: "AI Timetable System",
        status: "running"
    })
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server runnning at port ${PORT}`);
});