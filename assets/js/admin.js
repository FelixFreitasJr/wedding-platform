import { applyTheme, getCurrentUser, getEventConfig, logoutUser, saveEventConfig } from "./storage.js";

const user = getCurrentUser();

if (!user) {
    window.location.href = "./login.html";
}

const form = document.getElementById("adminForm");
const message = document.getElementById("adminMessage");
const config = getEventConfig();

applyTheme(config);

Object.entries(config).forEach(([key, value]) => {
    if (form.elements[key]) {
        form.elements[key].value = value;
    }
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const savedConfig = saveEventConfig(data);

    applyTheme(savedConfig);
    message.textContent = "Configurações salvas com sucesso.";
    message.dataset.type = "success";
});

document.getElementById("logoutButton").addEventListener("click", () => {
    logoutUser();
    window.location.href = "./login.html";
});
