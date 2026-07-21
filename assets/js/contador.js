import { getEventConfig } from "./storage.js";

const config = getEventConfig();
const weddingDate = new Date(`${config.eventDate}T${config.eventTime || "00:00"}:00`);

function atualizarContador() {
    const agora = new Date();
    const diferenca = weddingDate - agora;
    const title = document.querySelector("#countdown .section-title");

    if (!title) {
        return;
    }

    if (diferenca <= 0) {
        title.textContent = "💙 Chegou o grande dia!";
        return;
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

    document.getElementById("dias").textContent = dias;
    document.getElementById("horas").textContent = horas;
    document.getElementById("minutos").textContent = minutos;
    document.getElementById("segundos").textContent = segundos;
}

setInterval(atualizarContador, 1000);
atualizarContador();
