const button = document.getElementById("loadTimetable");
const output = document.getElementById("output");

button.addEventListener("click", async () => {
    await loadTimetable();
});

async function loadTimetable(){
    const teacherId = teacherSelect.value;
    console.log("Teacher ID =", teacherId);
    const response = await fetch(`/schedules?teacher_id=${teacherId}`);
    const data = await response.json();
    output.innerHTML = "";
    for(const schedule of data){
        output.innerHTML += `
            <tr>
                <td>${schedule.day_of_week}</td>
                <td>
                    ${schedule.start_time}
                    -
                    ${schedule.end_time}
                </td>
                <td>${schedule.subject_name}</td>
                <td>
                    ${schedule.teacher_code}
                    ${schedule.first_name}
                    ${schedule.last_name}
                </td>
                <td>${schedule.room_name}</td>
                <td>${schedule.group_name}</td>
            </tr>
        `;
    }
}

const teacherSelect = document.getElementById("teacherSelect");

async function loadTeacherSelect(){
    const response = await fetch("/teachers");
    const data = await response.json();
    teacherSelect.innerHTML = `<option value="">Select Teacher</option>`;

    for(const teacher of data){
        teacherSelect.innerHTML += `
            <option value="${teacher.teacher_id}">
                ${teacher.teacher_code} ${teacher.first_name} ${teacher.last_name}
            </option>
        `;
    }
}

loadTeacherSelect();