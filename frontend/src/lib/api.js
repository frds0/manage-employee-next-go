// lib/api.js

const BASE_URL = "http://localhost:8000";

export async function login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }), // harus sama dengan struct Go
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    return data;
}

export async function getMe() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch user");
    }

    return res.json();
}
