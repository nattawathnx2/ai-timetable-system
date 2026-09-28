const button = document.getElementById("loadTimetable");
const output = document.getElementById("output");

button.addEventListener("click", async () => {
    await loadTimetable();
});

async function loadTimetable(){
    const response = await fetch("/schedules");
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

loadTimetable();