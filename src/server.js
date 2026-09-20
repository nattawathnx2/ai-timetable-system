const express = require('express');
const app = express();

const teacherRoutes = require("./routes/teachers");
const subjectRoutes = require("./routes/subjects");
const roomRoutes = require("./routes/rooms");
const groupRoutes = require("./routes/student-group");
const schedulesRoutes = require("./routes/schedules");

app.use(express.json());
app.use("/teachers", teacherRoutes);
app.use("/subjects", subjectRoutes);
app.use("/rooms", roomRoutes);
app.use("/student-group", groupRoutes);
app.use("/schedules", schedulesRoutes);

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