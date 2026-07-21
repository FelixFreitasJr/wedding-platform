import { applyTheme, getCurrentUser, loadEventConfig, logoutUser, saveEventConfig } from "./storage.js";
import {
    getSupabaseSession,
    isSupabaseConfigured,
    saveRemoteEventConfig,
    signOutSupabase
} from "./supabase.js";

const form = document.getElementById("adminForm");
const message = document.getElementById("adminMessage");
const aiStoryStatus = document.getElementById("aiStoryStatus");
const generateStoryButton = document.getElementById("generateStoryButton");

async function requireSession() {
    if (isSupabaseConfigured) {
        const session = await getSupabaseSession();

        if (!session) {
            window.location.href = "./login.html";
        }

        return session;
    }

    const user = getCurrentUser();

    if (!user) {
        window.location.href = "./login.html";
    }

    return user;
}

function getFormConfig() {
    return Object.fromEntries(new FormData(form).entries());
}

function fillForm(config) {
    Object.entries(config).forEach(([key, value]) => {
        if (form.elements[key]) {
            form.elements[key].value = value;
        }
    });
}

function setStatus(element, text, type = "success") {
    element.textContent = text;
    element.dataset.type = type;
}

async function generateStory() {
    generateStoryButton.disabled = true;
    setStatus(aiStoryStatus, "Gerando uma sugestão de história...", "success");

    try {
        const response = await fetch("/.netlify/functions/generate-story", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                event: getFormConfig()
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Não foi possível gerar a história.");
        }

        form.elements.story.value = data.story;
        setStatus(aiStoryStatus, "História gerada. Revise o texto e clique em salvar.", "success");
    } catch (error) {
        setStatus(aiStoryStatus, error.message, "error");
    } finally {
        generateStoryButton.disabled = false;
    }
}

async function initAdmin() {
    await requireSession();

    const config = await loadEventConfig();
    applyTheme(config);
    fillForm(config);
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = getFormConfig();
    const savedConfig = saveEventConfig(data);

    applyTheme(savedConfig);

    try {
        await saveRemoteEventConfig(savedConfig);
        message.textContent = isSupabaseConfigured
            ? "Configurações salvas no Supabase com sucesso."
            : "Configurações salvas localmente com sucesso.";
        message.dataset.type = "success";
    } catch (error) {
        message.textContent = `Configuração salva localmente, mas houve erro no Supabase: ${error.message}`;
        message.dataset.type = "error";
    }
});

generateStoryButton.addEventListener("click", generateStory);

document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        await signOutSupabase();
    } finally {
        logoutUser();
        window.location.href = "./login.html";
    }
});

initAdmin();
