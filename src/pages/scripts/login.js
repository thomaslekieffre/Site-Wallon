async function login_request(email, password) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        body: formData,
    });
    const data = await response.json();
    
    return data;
}

document.addEventListener("DOMContentLoaded", async () => {
    const loginForm = document.querySelector("form");
    loginForm.addEventListener("submit", async e => {
        e.preventDefault();
        const email = loginForm.querySelector("#email").value;
        const password = loginForm.querySelector("#password").value;
        const response = await login_request(email, password);

        // login error
        if (response.status != 200) {
            const loginError = document.querySelector(".login-error");
            loginError.hidden = false;
            loginError.innerHTML = "Error : " + response.content;
        }
    });
});