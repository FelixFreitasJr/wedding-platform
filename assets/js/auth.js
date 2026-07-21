import { authenticateUser, saveUser } from "./storage.js";

const message = document.getElementById("authMessage");

function showMessage(text, type = "success") {
    message.textContent = text;
    message.dataset.type = type;
}

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        authenticateUser(document.getElementById("loginEmail").value, document.getElementById("loginPassword").value);
        window.location.href = "./admin.html";
    } catch (error) {
        showMessage(error.message, "error");
    }
});

document.getElementById("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    try {
        const user = saveUser({
            name: document.getElementById("registerName").value,
            email: document.getElementById("registerEmail").value,
            password: document.getElementById("registerPassword").value
        });
        authenticateUser(user.email, user.password);
        window.location.href = "./admin.html";
    } catch (error) {
        showMessage(error.message, "error");
    }
});
