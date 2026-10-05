const user = localStorage.getItem("user");
if(!user){
    window.location.href = "/index.html";
}

const currentUser = JSON.parse(user);
if(currentUser.role !== "admin"){
    window.location.href = "/dashboard.html";
}