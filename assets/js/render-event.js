import { applyTheme, formatEventDate, getEventConfig } from "./storage.js";

function setText(selector, text) {
    document.querySelectorAll(selector).forEach((element) => {
        element.textContent = text;
    });
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

export function renderEventPage() {
    const config = getEventConfig();
    const couple = `${config.bride} & ${config.groom}`;
    const formattedDate = formatEventDate(config.eventDate);

    applyTheme(config);
    document.title = `${couple} | ${formattedDate}`;

    setText("[data-couple]", couple);
    setText("[data-bride]", config.bride);
    setText("[data-groom]", config.groom);
    setText("[data-invitation-subtitle]", config.invitationSubtitle);
    setText("[data-event-date]", formattedDate);
    setText("[data-event-time]", config.eventTime);
    setText("[data-ceremony-place]", config.ceremonyPlace);
    setText("[data-ceremony-address]", config.ceremonyAddress);
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
