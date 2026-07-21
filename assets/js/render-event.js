import { applyTheme, formatEventDate, loadEventConfig } from "./storage.js";

function setText(selector, text) {
    document.querySelectorAll(selector).forEach((element) => {
        element.textContent = text;
    });
}

function formatEventType(value) {
    const labels = {
        casamento: "Casamento",
        aniversario: "Aniversário",
        formatura: "Formatura",
        "cha-de-bebe": "Chá de bebê",
        corporativo: "Evento corporativo",
        outro: "Evento"
    };

    return labels[value] || value || "Evento";
}

function setHref(selector, href, fallback = "#") {
    document.querySelectorAll(selector).forEach((element) => {
        element.href = href || fallback;

        if (href) {
            element.target = "_blank";
            element.rel = "noopener noreferrer";
        } else {
            element.removeAttribute("target");
            element.removeAttribute("rel");
        }
    });
}

export async function renderEventPage() {
    const config = await loadEventConfig();
    const couple = `${config.bride} & ${config.groom}`;
    const formattedDate = formatEventDate(config.eventDate);

    applyTheme(config);
    document.title = `${couple} | ${formattedDate}`;

    setText("[data-couple]", couple);
    setText("[data-bride]", config.bride);
    setText("[data-groom]", config.groom);
    setText("[data-event-type]", formatEventType(config.eventType));
    setText("[data-invitation-subtitle]", config.invitationSubtitle);
    setText("[data-event-date]", formattedDate);
    setText("[data-event-time]", config.eventTime);
    setText("[data-ceremony-place]", config.ceremonyPlace);
    setText("[data-ceremony-address]", config.ceremonyAddress);
    setText("[data-dress-code]", config.dressCode || "A definir");
    setText("[data-reception-place]", config.receptionPlace);
    setText("[data-reception-time]", config.receptionTime);
    setText("[data-reception-address]", config.receptionAddress);
    setText("[data-story]", config.story);
    setText("[data-gift-intro]", config.giftIntro);
    setText("[data-pix-key]", config.pixKey || "Chave Pix a definir");
    setHref("[data-ceremony-map]", config.ceremonyMapUrl);
    setHref("[data-reception-map]", config.receptionMapUrl);
    setHref("[data-gift-list]", config.giftListUrl);
    setHref("[data-honeymoon]", config.honeymoonUrl);
}

renderEventPage();
