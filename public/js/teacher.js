const button = document.getElementById("loadTeachers");
const output = document.getElementById("output");

button.addEventListener("click", async () => {
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
            </tr>
        `;
    }
});