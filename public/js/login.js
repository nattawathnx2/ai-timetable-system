const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

loginBtn.addEventListener("click", async () => {
    const loginData = {
        username: usernameInput.value,
        password: passwordInput.value
    }

    const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });
    const data = await response.json();
    if(response.ok){
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );
        window.location.href = "/dashboard.html";
    }else{
        message.textContent = data.error;
    }
    console.log(data);
});