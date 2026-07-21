import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { supabaseConfig } from "./supabase-config.js";

const hasConfig = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

export const isSupabaseConfigured = hasConfig;
export const supabase = hasConfig
    ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;

export async function getSupabaseSession() {
    if (!supabase) {
        return null;
    }

    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.warn("Erro ao buscar sessão Supabase.", error);
        return null;
    }

    return data.session;
}

export async function signInWithGoogle() {
    if (!supabase) {
        throw new Error("Supabase ainda não foi configurado.");
    }

    const redirectTo = new URL("/pages/admin.html", window.location.origin).toString();
    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo
        }
    });

    if (error) {
        throw error;
    }
}

export async function signInWithEmail(email, password) {
    if (!supabase) {
        throw new Error("Supabase ainda não foi configurado.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        throw error;
    }

    return data.user;
}

export async function signUpWithEmail(name, email, password) {
    if (!supabase) {
        throw new Error("Supabase ainda não foi configurado.");
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name }
        }
    });

    if (error) {
        throw error;
    }

    return data.user;
}

export async function signOutSupabase() {
    if (!supabase) {
        return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}

export async function fetchRemoteEventConfig() {
    if (!supabase) {
        return null;
    }

    const { data, error } = await supabase
        .from("event_config")
        .select("config")
        .eq("id", "default")
        .maybeSingle();

    if (error) {
        console.warn("Erro ao carregar configuração do Supabase.", error);
        return null;
    }

    return data?.config ?? null;
}

export async function saveRemoteEventConfig(config) {
    if (!supabase) {
        return null;
    }

    const { data, error } = await supabase
        .from("event_config")
        .upsert({
            id: "default",
            config,
            updated_at: new Date().toISOString()
        })
        .select("config")
        .single();

    if (error) {
        throw error;
    }

    return data.config;
}

export async function saveRemoteRsvp(rsvp) {
    if (!supabase) {
        return null;
    }

    const { data, error } = await supabase
        .from("rsvps")
        .insert({ payload: rsvp })
        .select("id")
        .single();

    if (error) {
        throw error;
    }

    return data;
}
