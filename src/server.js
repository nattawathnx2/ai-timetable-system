const express = require('express');
const app = express();

const teacherRoutes = require("./routes/teachers");
const subjectRoutes = require("./routes/subjects");
const roomRoutes = require("./routes/rooms");
const groupRoutes = require("./routes/student-groups");
const schedulesRoutes = require("./routes/schedules");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(express.static("public"));

app.use("/teachers", teacherRoutes);
app.use("/subjects", subjectRoutes);
app.use("/rooms", roomRoutes);
app.use("/student-groups", groupRoutes);
app.use("/schedules", schedulesRoutes);
app.use("/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server runnning at port ${PORT}`);
});