// Load Schedules
const button = document.getElementById("loadSchedules");
const output = document.getElementById("output");
let currentSchedulesId = null;

button.addEventListener("click", async () => {
    await loadSchedules();
});

function clearSchedulesInput(){
    dayInput.value = "";
    startTimeInput.value = "";
    endTimeInput.value = "";
    teacherSelect.value = "";
    subjectSelect.value = "";
    roomSelect.value = "";
    groupSelect.value = "";
}

async function loadSchedules(){
    const response = await fetch("/schedules");
    const data = await response.json();
    
    output.innerHTML = "";

    for(const schedule of data){
        output.innerHTML += `
            <tr>
                <td>${schedule.schedule_id}</td>
                <td>${schedule.day_of_week}</td>
                <td>${schedule.start_time}</td>
                <td>${schedule.end_time}</td>
                <td>${schedule.teacher_code} ${schedule.first_name}</td>
                <td>${schedule.subject_name}</td>
                <td>${schedule.room_name}</td>
                <td>${schedule.group_name}</td>
                <td>
                    <button class="delete-btn"
                        data-id="${schedule.schedule_id}"
                        data-day="${schedule.day_of_week}"
                    > Delete
                    </button>
                </td>
                <td>
                    <button class="edit-btn"
                        data-id="${schedule.schedule_id}"
                        data-day="${schedule.day_of_week}"
                        data-starttime="${schedule.start_time}"
                        data-endtime="${schedule.end_time}"
                        data-teacher="${schedule.teacher_id}"
                        data-subject="${schedule.subject_id}"
                        data-room="${schedule.room_id}"
                        data-group="${schedule.group_id}"
                    > Edit
                    </button>
                </td>
            </tr>
        `;
    }

    const editButton = document.querySelectorAll(".edit-btn");
    editButton.forEach(button => {
        button.addEventListener("click", async () => {
            currentSchedulesId = button.dataset.id;

            dayInput.value = button.dataset.day;
            startTimeInput.value = button.dataset.starttime;
            endTimeInput.value = button.dataset.endtime;
            teacherSelect.value = button.dataset.teacher;
            subjectSelect.value = button.dataset.subject;
            roomSelect.value = button.dataset.room;
            groupSelect.value = button.dataset.group;

            addButton.style.display = "none";
            updateButton.style.display = "inline";
        });
    });

    const deleteButton = document.querySelectorAll(".delete-btn");
    deleteButton.forEach(button => {
        button.addEventListener("click", async () => {
            const scheduleId = button.dataset.id;
            const dayOfWeek = button.dataset.day;
            const isConfirmed = confirm(`คุณแน่ใจที่จะลบตารางเรียน ${scheduleId} ของ ${dayOfWeek} ใช่หรือไม่?`);
            if(!isConfirmed){return;}
            await fetch(`/schedules/${scheduleId}`, {
                method: "DELETE"
            });
            await loadSchedules();
        });
    });
}

// Select Data (teachers, subjects, rooms, student-groups)
const teacherSelect = document.getElementById("teacherSelect");
const subjectSelect = document.getElementById("subjectSelect");
const roomSelect = document.getElementById("roomSelect");
const groupSelect = document.getElementById("groupSelect");

async function loadTeacherSelect(){
    const response = await fetch("/teachers");
    const data = await response.json();

    teacherSelect.innerHTML =
        `<option value="">Select Teacher</option>`;
    
    for(const teacher of data){
        teacherSelect.innerHTML += `
            <option value="${teacher.teacher_id}">
                ${teacher.teacher_code} ${teacher.first_name} ${teacher.last_name}
            </option>
        `;
    }
}

async function loadSubjectSelect(){
    const respone = await fetch("/subjects");
    const data = await respone.json();

    subjectSelect.innerHTML = 
        `<option value="">Load Subject</option>`;

    for(const subject of data){
        subjectSelect.innerHTML += `
            <option value="${subject.subject_id}">
            ${subject.subject_code} ${subject.subject_name}
            </option>
        `;
    }
}

async function loadRoomSelect(){
    const respone = await fetch("/rooms");
    const data = await respone.json();

    roomSelect.innerHTML =
        `<option value="">Load Room</option>`;

    for(const room of data){
        roomSelect.innerHTML += `
            <option value="${room.room_id}">
            ${room.room_code} ${room.room_name}
            </option>
        `;
    }
}

async function loadGroupSelect(){
    const response = await fetch("/student-groups");
    const data = await response.json();

    groupSelect.innerHTML =
        `<option value="">Load Group</option>`;

    for(const group of data){
        groupSelect.innerHTML += `
            <option value="${group.group_id}">
            ${group.group_code} ${group.group_name} ${group.academic_year} [ ${group.student_count} ]
            </option>
        `;
    }
}

loadTeacherSelect();
loadSubjectSelect();
loadRoomSelect();
loadGroupSelect();

// Add Schedules
const addButton = document.getElementById("addSchedules");
const dayInput = document.getElementById("dayOfWeek");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime"); 

addButton.addEventListener("click", async () => {
    const scheduleData = {
        day_of_week: dayInput.value,
        start_time: startTimeInput.value,
        end_time: endTimeInput.value,
        teacher_id: teacherSelect.value,
        subject_id: subjectSelect.value,
        room_id: roomSelect.value,
        group_id: groupSelect.value
    }

    const response = await fetch("/schedules", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scheduleData)
    });
    const data = await response.json();
    await loadSchedules();
    clearSchedulesInput();
    dayInput.focus();
    console.log(data);
});

// Update Schedules
const updateButton = document.getElementById("updateSchedules");
updateButton.style.display = "none";
updateButton.addEventListener("click", async () => {
    const scheduleData = {
        day_of_week: dayInput.value,
        start_time: startTimeInput.value,
        end_time: endTimeInput.value,
        teacher_id: teacherSelect.value,
        subject_id: subjectSelect.value,
        room_id: roomSelect.value,
        group_id: groupSelect.value
    }

    await fetch(`/schedules/${currentSchedulesId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(scheduleData)
    });
    await loadSchedules();
    clearSchedulesInput();
    currentSchedulesId = null;
    updateButton.style.display = "none";
    addButton.style.display = "inline";
});