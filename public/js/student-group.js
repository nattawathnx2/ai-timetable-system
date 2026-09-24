const button = document.getElementById("loadGroups")
const output = document.getElementById("output");
let currentGroupId = null;

button.addEventListener("click", async () => {
    await loadGroups();
});

async function loadGroups(){
    const response = await fetch("/student-groups");
    const data = await response.json();

    output.innerHTML = "";

    for(const group of data){
        output.innerHTML += `
            <tr>
                <td>${group.group_id}</td>
                <td>${group.group_code}</td>  
                <td>${group.group_name}</td>  
                <td>${group.academic_year}</td>  
                <td>${group.student_count}</td>
                <td>
                    <button class="delete-btn" 
                    data-id="${group.group_id}"
                    data-groupcode="${group.group_code}"
                    data-groupname="${group.group_name}"
                    >
                        Delete
                    </button>
                </td>
                <td>
                    <button
                        class="edit-btn"
                        data-id="${group.group_id}"
                        data-code="${group.group_code}"
                        data-name="${group.group_name}"
                        data-year="${group.academic_year}"
                        data-count="${group.student_count}"
                    >
                        Edit
                    </button>
                </td>
            </tr>
        `;
    }

    const deleteButton = document.querySelectorAll(".delete-btn");
    deleteButton.forEach(button => {
        button.addEventListener("click", async () => {
            const groupId = button.dataset.id;
            const groupCode = button.dataset.groupcode;
            const groupName = button.dataset.groupname;

            const isConfirmed = confirm(`คุณยืนยันที่จะลบ ${groupCode} ${groupName} ใช่หรือไม่?`);
            if(!isConfirmed){return;}
            await fetch(`/student-groups/${groupId}`, {
                method: "DELETE"
            });
            await loadGroups();
        });
    });

    const editButton = document.querySelectorAll(".edit-btn");
    editButton.forEach(button => {
        button.addEventListener("click", () => {
            currentGroupId = button.dataset.id;

            groupCodeInput.value = button.dataset.code;
            groupNameInput.value = button.dataset.name;
            academicYearInput.value = button.dataset.year;
            studentCountInput.value = button.dataset.count;

            addButton.style.display = "none";
            updateButton.style.display = "inline";
        });
    });
}

function clearInputGroups(){
    groupCodeInput.value = "";
    groupNameInput.value = "";
    academicYearInput.value = "";
    studentCountInput.value = "";
}

const updateButton = document.getElementById("updateGroups");
updateButton.style.display = "none";
updateButton.addEventListener("click", async () => {
    const groupData = {
        group_code: groupCodeInput.value,
        group_name: groupNameInput.value,
        academic_year: academicYearInput.value,
        student_count: studentCountInput.value
    }

    await fetch(`/student-groups/${currentGroupId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(groupData)
    });
    await loadGroups();
    clearInputGroups();
    currentGroupId = null;
    updateButton.style.display = "none";
    addButton.style.display = "inline";
});

const addButton = document.getElementById("addGroups");
const groupCodeInput = document.getElementById("groupCode");
const groupNameInput = document.getElementById("groupName");
const academicYearInput = document.getElementById("academicYears");
const studentCountInput = document.getElementById("studentConst");

addButton.addEventListener("click", async () => {
    const groupData = {
        group_code: groupCodeInput.value,
        group_name: groupNameInput.value,
        academic_year: academicYearInput.value,
        student_count: studentCountInput.value
    }

    const response = await fetch("/student-groups", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(groupData)
    });
    const data = await response.json();
    await loadGroups();
    clearInputGroups();
    groupCodeInput.focus();
    console.log(data);
});