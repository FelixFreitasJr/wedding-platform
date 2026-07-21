import { authenticateUser, saveUser } from "./storage.js";
import {
    isSupabaseConfigured,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail
} from "./supabase.js";

const message = document.getElementById("authMessage");
const googleButton = document.getElementById("googleLoginButton");

function showMessage(text, type = "success") {
    message.textContent = text;
    message.dataset.type = type;
}

googleButton.disabled = !isSupabaseConfigured;
googleButton.title = isSupabaseConfigured
    ? "Entrar com Google"
    : "Configure o Supabase para habilitar login com Google";

googleButton.addEventListener("click", async () => {
    try {
        await signInWithGoogle();
    } catch (error) {
        showMessage(error.message, "error");
    }
});

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        if (isSupabaseConfigured) {
            await signInWithEmail(email, password);
        } else {
            authenticateUser(email, password);
        }

        window.location.href = "./admin.html";
    } catch (error) {
        showMessage(error.message, "error");
    }
});

document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
        if (isSupabaseConfigured) {
            await signUpWithEmail(name, email, password);
            showMessage("Cadastro criado. Se o Supabase exigir confirmação, confirme seu e-mail antes de entrar.");
            return;
        }

        const user = saveUser({ name, email, password });
        authenticateUser(user.email, user.password);
        window.location.href = "./admin.html";
    } catch (error) {
        showMessage(error.message, "error");
    }
});
