// GET teachers Table
const button = document.getElementById("loadTeachers");
const output = document.getElementById("output");
let currentTeacherId = null;

button.addEventListener("click", async () => {
    await loadTeachers();
});

// function loader teachers
async function loadTeachers(){
    const response = await fetch("/teachers");
    const data = await response.json();
    
    output.innerHTML = "";

    for(const teacher of data){
        output.innerHTML += `
            <tr>
                <td>${teacher.teacher_id}</td>
                <td>${teacher.teacher_code}</td>  
                <td>${teacher.first_name}</td>  
                <td>${teacher.last_name}</td>  
                <td>${teacher.department}</td>
                <td>
                    <button class="delete-btn" 
                    data-id="${teacher.teacher_id}"
                    data-firstName="${teacher.first_name}"
                    data-lastName="${teacher.last_name}"
                    >
                        Delete
                    </button>
                </td>
                <td>
                    <button
                        class="edit-btn"
                        data-id="${teacher.teacher_id}"
                        data-code="${teacher.teacher_code}"
                        data-firstname="${teacher.first_name}"
                        data-lastname="${teacher.last_name}"
                        data-department="${teacher.department}"
                    >
                        Edit
                    </button>
                </td>
            </tr>
        `;
    }

    // Delete Teachers
    const deleteButton = document.querySelectorAll(".delete-btn");
    deleteButton.forEach(button => {
        button.addEventListener("click", async () => {
            const teacherId = button.dataset.id;
            const firstName = button.dataset.firstname;
            const lastName = button.dataset.lastname;
            const isConfirmed = confirm(`คุณแน่ใจที่จะลบ ${firstName} ${lastName} ใช่หรือไม่?`);
            if(!isConfirmed){return;}
            await fetch(`/teachers/${teacherId}`, {
                method: "DELETE"
            });
            await loadTeachers();
        });
    });

    // select data teacher in form
    const editButton = document.querySelectorAll(".edit-btn");
    editButton.forEach(button => {
        button.addEventListener("click", async () => {
            currentTeacherId = button.dataset.id;

            teacherCodeInput.value = button.dataset.code;
            firstNameInput.value = button.dataset.firstname;
            lastNameInput.value = button.dataset.lastname;
            departmentInput.value = button.dataset.department;

            addButton.style.display = "none";
            updateButton.style.display = "inline";
        });
    });
}

// function clear input
function clearInputTeacher(){
    teacherCodeInput.value = "";
    firstNameInput.value = "";
    lastNameInput.value = "";
    departmentInput.value = "";
}

// Add Teachers
const addButton = document.getElementById("addTeacher");
const teacherCodeInput = document.getElementById("teacherCode");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName"); 
const departmentInput = document.getElementById("department");

addButton.addEventListener("click", async () => {
    const teacherData = {
        teacher_code: teacherCodeInput.value,
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        department: departmentInput.value
    };

    const response = await fetch("/teachers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(teacherData)
    });

    const data = await response.json();
    await loadTeachers();
    clearInputTeacher();
    teacherCodeInput.focus();
    console.log(data);
});

// Edit data teachers
const updateButton = document.getElementById("updateTeacher");
updateButton.style.display = "none";

updateButton.addEventListener("click", async () => {
    const teacherData = {
        teacher_code: teacherCodeInput.value,
        first_name: firstNameInput.value,
        last_name: lastNameInput.value,
        department: departmentInput.value
    }

    await fetch(`/teachers/${currentTeacherId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(teacherData)
    });
    await loadTeachers();
    clearInputTeacher();
    currentTeacherId = null;
    updateButton.style.display = "none";
    addButton.style.display = "inline";
});