const button = document.getElementById("loadTimetable");
const output = document.getElementById("output");

button.addEventListener("click", async () => {
    await loadTimetable();
});

async function loadTimetable(){
    const teacherId = teacherSelect.value;
    const subjectId = subjectSelect.value;
    const roomId = roomSelect.value;
    const groupId = groupSelect.value;
    console.log("Teacher ID =", teacherId);
    const response = await fetch(`/schedules?teacher_id=${teacherId}&subject_id=${subjectId}&room_id=${roomId}&group_id=${groupId}`);
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
const subjectSelect = document.getElementById("subjectSelect");
const roomSelect = document.getElementById("roomSelect");
const groupSelect = document.getElementById("groupSelect");

async function loadSubjectSelect(){
    const response = await fetch("/subjects");
    const data = await response.json();
    subjectSelect.innerHTML = `<option value="">Select Subject</option>`;

    for(const subject of data){
        subjectSelect.innerHTML += `
            <option value="${subject.subject_id}">
                ${subject.subject_code} ${subject.subject_name}
            </option>
        `;
    }
}

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

async function loadRoomSelect(){
    const response = await fetch("/rooms");
    const data = await response.json();
    roomSelect.innerHTML = `<option value="">Select Room</option>`;

    for(const room of data){
        roomSelect.innerHTML += `
            <option value="${room.room_id}">
                ${room.room_name}
            </option>
        `;
    }
}

async function loadGroupSelect(){
    const response = await fetch("/student-groups");
    const data = await response.json();
    groupSelect.innerHTML = `<option value="">Select Group</option>`;

    for(const group of data){
        groupSelect.innerHTML += `
            <option value="${group.group_id}">
                ${group.group_name}
            </option>
        `;
    }
}

loadTeacherSelect();
loadSubjectSelect();
loadRoomSelect();
loadGroupSelect();