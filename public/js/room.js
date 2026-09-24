const button = document.getElementById("loadRooms");
const output = document.getElementById("output");
let currentRoomId = null;

button.addEventListener("click", async () => {
    await loadRooms();
});

function clearInputRooms(){
    roomCodeInput.value = "";
    roomNameInput.value = "";
    roomTypeInput.value = "";
}

async function loadRooms(){
    const response = await fetch("/rooms");
    const data = await response.json();

    output.innerHTML = "";

    for(const room of data){
        output.innerHTML += `
            <tr>
                <td>${room.room_id}</td>
                <td>${room.room_code}</td>  
                <td>${room.room_name}</td>  
                <td>${room.room_type}</td>  
                <td>
                    <button class="delete-btn" 
                    data-id="${room.room_id}"
                    data-roomname="${room.room_name}"
                    data-roomtype="${room.room_type}"
                    >
                        Delete
                    </button>
                </td>
                <td>
                    <button
                        class="edit-btn"
                        data-id="${room.room_id}"
                        data-code="${room.room_code}"
                        data-name="${room.room_name}"
                        data-type="${room.room_type}"
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
            const roomId = button.dataset.id;
            const roomName = button.dataset.roomname;
            const roomType = button.dataset.roomtype;
            const isConfirmed = confirm(`คุณแน่ใจที่จะลบห้อง ${roomName} ประเภท ${roomType} หรือไม่?`);
            if(!isConfirmed){return;}
            await fetch(`/rooms/${roomId}`, {
                method: "DELETE"
            });
            await loadRooms();
        });
    });

    const editButton = document.querySelectorAll(".edit-btn");
    editButton.forEach(button => {
        button.addEventListener("click", async () => {
            currentRoomId = button.dataset.id;

            roomCodeInput.value = button.dataset.code;
            roomNameInput.value = button.dataset.name;
            roomTypeInput.value = button.dataset.type;
            
            addButton.style.display = "none";
            updateButton.style.display = "inline";
        });
    });
}

const addButton = document.getElementById("addRooms");
const roomCodeInput = document.getElementById("roomCode");
const roomNameInput = document.getElementById("roomName");
const roomTypeInput = document.getElementById("roomType");

addButton.addEventListener("click", async () => {
    const roomData = {
        room_code: roomCodeInput.value,
        room_name: roomNameInput.value,
        room_type: roomTypeInput.value
    };

    const response = await fetch("/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(roomData)
    });

    const data = await response.json();
    await loadRooms();
    clearInputRooms();
    roomCodeInput.focus();
    console.log(data);
});

const updateButton = document.getElementById("updateRooms");
updateButton.style.display = "none";

updateButton.addEventListener("click", async () => {
    const roomData = {
        room_code: roomCodeInput.value,
        room_name: roomNameInput.value,
        room_type: roomTypeInput.value
    };

    await fetch(`/rooms/${currentRoomId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(roomData)
    });
    await loadRooms();
    clearInputRooms();
    currentRoomId = null;
    addButton.style.display = "inline";
    updateButton.style.display = "none";
});