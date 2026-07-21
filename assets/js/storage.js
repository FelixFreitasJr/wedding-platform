import { fetchRemoteEventConfig, isSupabaseConfigured } from "./supabase.js";

const STORAGE_KEYS = {
    event: "weddingPlatform.eventConfig",
    users: "weddingPlatform.users",
    session: "weddingPlatform.sessionUser",
    rsvps: "weddingPlatform.rsvps"
};

const defaultEventConfig = {
    bride: "Viviane",
    groom: "Everson",
    eventType: "casamento",
    invitationSubtitle: "Temos a alegria de convidar você para celebrar conosco",
    eventDate: "2027-06-19",
    eventTime: "15:30",
    ceremonyPlace: "Igreja Nossa Senhora",
    ceremonyAddress: "Rio de Janeiro - RJ",
    dressCode: "Traje social",
    ceremonyMapUrl: "",
    receptionPlace: "Espaço Garden",
    receptionTime: "18:00",
    receptionAddress: "Rio de Janeiro - RJ",
    receptionMapUrl: "",
    story: "Em breve nossa história estará aqui. ❤️",
    giftIntro: "Sua presença é o nosso maior presente. Mas, caso deseje nos presentear, preparamos algumas opções com muito carinho.",
    giftListUrl: "",
    honeymoonUrl: "",
    pixKey: "",
    whatsapp: "5521999999999",
    email: "noivos@example.com",
    primaryColor: "#A9D6F5",
    secondaryColor: "#27B4E5",
    accentColor: "#8FB996"
};

function readJson(key, fallback) {
    const stored = localStorage.getItem(key);

    if (!stored) {
        return fallback;
    }

    try {
        return JSON.parse(stored);
    } catch (error) {
        console.warn(`Não foi possível ler ${key}. Usando padrão.`, error);
        return fallback;
    }
}

export function getEventConfig() {
    return {
        ...defaultEventConfig,
        ...readJson(STORAGE_KEYS.event, {})
    };
}


export async function loadEventConfig() {
    const localConfig = getEventConfig();

    if (!isSupabaseConfigured) {
        return localConfig;
    }

    const remoteConfig = await fetchRemoteEventConfig();

    if (!remoteConfig) {
        return localConfig;
    }

    return saveEventConfig(remoteConfig);
}

export function saveEventConfig(config) {
    const nextConfig = {
        ...getEventConfig(),
        ...config
    };

    localStorage.setItem(STORAGE_KEYS.event, JSON.stringify(nextConfig));
    return nextConfig;
}

export function getUsers() {
    return readJson(STORAGE_KEYS.users, []);
}

export function saveUser(user) {
    const users = getUsers();
    const emailExists = users.some((storedUser) => storedUser.email === user.email);

    if (emailExists) {
        throw new Error("Já existe um usuário cadastrado com este e-mail.");
    }

    const nextUser = {
        id: crypto.randomUUID(),
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify([...users, nextUser]));
    return nextUser;
}

export function authenticateUser(email, password) {
    const user = getUsers().find((storedUser) => (
        storedUser.email === email && storedUser.password === password
    ));

    if (!user) {
        throw new Error("E-mail ou senha inválidos.");
    }

    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email
    }));

    return user;
}

export function getCurrentUser() {
    return readJson(STORAGE_KEYS.session, null);
}

export function logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.session);
}

export function saveRsvp(rsvp) {
    const rsvps = readJson(STORAGE_KEYS.rsvps, []);
    const nextRsvp = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...rsvp
    };

    localStorage.setItem(STORAGE_KEYS.rsvps, JSON.stringify([...rsvps, nextRsvp]));
    return nextRsvp;
}

export function getRsvps() {
    return readJson(STORAGE_KEYS.rsvps, []);
}

export function formatEventDate(dateValue) {
    if (!dateValue) {
        return "Data a definir";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    }).format(new Date(`${dateValue}T00:00:00Z`));
}

export function applyTheme(config = getEventConfig()) {
    const root = document.documentElement;

    root.style.setProperty("--primary-color", config.primaryColor);
    root.style.setProperty("--secondary-color", config.secondaryColor);
    root.style.setProperty("--accent-color", config.accentColor);
    root.style.setProperty(
        "--gradient-primary",
        `linear-gradient(180deg, ${config.primaryColor} 0%, #F8FCFF 40%, #FFFFFF 100%)`
    );
}
