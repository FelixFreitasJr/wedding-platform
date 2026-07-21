import { applyTheme, formatEventDate, getEventConfig, saveRsvp } from "./storage.js";

const config = getEventConfig();
applyTheme(config);

const restricao = document.getElementById("restricao");
const outraRestricao = document.getElementById("outraRestricao");
const formulario = document.getElementById("rsvpForm");
const statusMessage = document.getElementById("rsvpStatus");

function setText(selector, text) {
    document.querySelectorAll(selector).forEach((element) => {
        element.textContent = text;
    });
}

setText("[data-bride]", config.bride);
setText("[data-groom]", config.groom);
setText("[data-event-date]", formatEventDate(config.eventDate));
setText("[data-invitation-subtitle]", config.invitationSubtitle);

actionRestricao();
restricao.addEventListener("change", actionRestricao);

function actionRestricao() {
    const isOther = restricao.value === "Outro";
    outraRestricao.style.display = isOther ? "block" : "none";

    if (!isOther) {
        outraRestricao.value = "";
    }
}

function buildMessage(dados) {
    return `Nova confirmação de presença:

Tipo: ${dados.tipoConvidado}
Nome: ${dados.nome}
WhatsApp: ${dados.telefone}
Presença: ${dados.presenca}
Adultos: ${dados.adultos}
Crianças: ${dados.criancas}
Restrição: ${dados.restricao}${dados.outraRestricao ? ` - ${dados.outraRestricao}` : ""}
Mensagem: ${dados.mensagem || "Sem mensagem"}`;
}

formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const dados = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        tipoConvidado: document.getElementById("tipoConvidado").value,
        presenca: document.querySelector('input[name="presenca"]:checked').value,
        adultos: document.getElementById("adultos").value,
        criancas: document.getElementById("criancas").value,
        restricao: document.getElementById("restricao").value,
        outraRestricao: document.getElementById("outraRestricao").value,
        mensagem: document.getElementById("mensagem").value
    };

    saveRsvp(dados);

    const encodedMessage = encodeURIComponent(buildMessage(dados));
    const whatsappNumber = config.whatsapp.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    const emailUrl = `mailto:${config.email}?subject=Confirmação de presença - ${encodeURIComponent(dados.nome)}&body=${encodedMessage}`;

    statusMessage.innerHTML = `Obrigado! Sua confirmação foi registrada. <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">Enviar para o WhatsApp dos noivos</a> ou <a href="${emailUrl}">enviar por e-mail</a>.`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    formulario.reset();
    actionRestricao();
});
