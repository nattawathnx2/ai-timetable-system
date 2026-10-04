const user = localStorage.getItem("user");
if(!user){
    window.location.href = "/index.html";
}

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async () => {
    localStorage.removeItem("user");
    window.location.href = "/index.html";
});