const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.6-luna";

function json(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };
}

function buildPrompt(event) {
    const eventType = event.eventType || "evento";
    const hosts = [event.bride, event.groom].filter(Boolean).join(" e ") || "os anfitriões";

    return `Escreva a seção "Nossa história" para um site de ${eventType} em português do Brasil.
Use um tom romântico, acolhedor, elegante e convidativo, mas sem exageros.
O texto deve ter de 2 a 4 parágrafos curtos e soar humano.
Inclua os anfitriões/noivos: ${hosts}.
Data do evento: ${event.eventDate || "a definir"}.
Local: ${event.ceremonyPlace || event.receptionPlace || "a definir"}.
Se for casamento, valorize amor, parceria e presença dos convidados.
Se for festa ou outro evento, adapte o tom para celebração, alegria e boas memórias.
Não invente detalhes específicos de como se conheceram; seja emocional e genérico quando faltar contexto.`;
}

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return json(405, { error: "Método não permitido." });
    }

    if (!process.env.OPENAI_API_KEY) {
        return json(500, { error: "OPENAI_API_KEY não configurada no Netlify." });
    }

    const payload = JSON.parse(event.body || "{}");
    const prompt = buildPrompt(payload.event || {});

    const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
            input: prompt,
            text: {
                verbosity: "medium"
            }
        })
    });

    const data = await response.json();

    if (!response.ok) {
        return json(response.status, {
            error: data.error?.message || "Não foi possível gerar a história."
        });
    }

    const story = data.output_text
        || data.output?.flatMap((item) => item.content || [])
            .map((content) => content.text)
            .filter(Boolean)
            .join("\n\n")
        || "";

    return json(200, { story: story.trim() });
}
