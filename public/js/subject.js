// GET subject table
const button = document.getElementById("loadSubjects");
const output = document.getElementById("output");
let currentSubjectId = null;

button.addEventListener("click", async () => {
    await loadSubjects();
});

// function clear input subjects
function clearInputSubjects(){
    subjectCodeInput.value = "";
    subjectNameInput.value = "";
    creditsInput.value = "";
    hoursInput.value = "";
}

async function loadSubjects(){
    const response = await fetch("/subjects");
    const data = await response.json();

    output.innerHTML = "";

    for(const subject of data){
        output.innerHTML += `
            <tr>
                <td>${subject.subject_id}</td>
                <td>${subject.subject_code}</td>  
                <td>${subject.subject_name}</td>  
                <td>${subject.credits}</td>  
                <td>${subject.hours_per_week}</td>
                <td>
                    <button class="delete-btn" 
                    data-id="${subject.subject_id}"
                    data-subjectname="${subject.subject_name}"
                    >
                        Delete
                    </button>
                </td>
                <td>
                    <button
                        class="edit-btn"
                        data-id="${subject.subject_id}"
                        data-code="${subject.subject_code}"
                        data-name="${subject.subject_name}"
                        data-credits="${subject.credits}"
                        data-hours="${subject.hours_per_week}"
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
            const subjectId = button.dataset.id;
            const subjectName = button.dataset.subjectname;
            const isConfirmed = confirm(`คุณแน่ใจที่จะลบวิชา ${subjectName} ใช่หรือไม่?`);
            if(!isConfirmed){return;}
            await fetch(`/subjects/${subjectId}`, {
                method: "DELETE"
            })
            await loadSubjects();
        });
    });

    const editButton = document.querySelectorAll(".edit-btn");
    editButton.forEach(button => {
        button.addEventListener("click", async () => {
            currentSubjectId = button.dataset.id;
            
            subjectCodeInput.value = button.dataset.code;
            subjectNameInput.value = button.dataset.name;
            creditsInput.value = button.dataset.credits;
            hoursInput.value = button.dataset.hours;

            addButton.style.display = "none";
            updateButton.style.display = "inline";
        });
    });
}

// Edit Subjects
const updateButton = document.getElementById("updateSubjects");
updateButton.style.display = "none";
updateButton.addEventListener("click", async () => {
    const subjectData = {
        subject_code: subjectCodeInput.value,
        subject_name: subjectNameInput.value,
        credits: creditsInput.value,
        hours_per_week: hoursInput.value
    };

    await fetch(`/subjects/${currentSubjectId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(subjectData)
    });

    await loadSubjects();
    clearInputSubjects();
    currentSubjectId = null;
    addButton.style.display = "inline";
    updateButton.style.display = "none";
});

// Add Subjects
const addButton = document.getElementById("addSubjects");
const subjectCodeInput = document.getElementById("subjectCode");
const subjectNameInput = document.getElementById("subjectName");
const creditsInput = document.getElementById("credits");
const hoursInput = document.getElementById("hours");

addButton.addEventListener("click", async () => {
    const subjectData = {
        subject_code: subjectCodeInput.value,
        subject_name: subjectNameInput.value,
        credits: creditsInput.value,
        hours_per_week: hoursInput.value
    };

    const response = await fetch("/subjects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(subjectData)
    });

    const data = await response.json();
    await loadSubjects();
    clearInputSubjects();
    subjectCodeInput.focus();
    console.log(data);
});