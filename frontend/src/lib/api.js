const BASE_URL = "http://localhost:8000";

export async function login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }), 
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

export async function getEmployees(){
    const token = localStorage.getItem("token"); 

    const res = await fetch(`${BASE_URL}/employees`, {
        headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch employees");
    }

    return res.json();
}

export async function getEmployeeById(id) {
    const res = await fetch(`http://localhost:8000/employee/${id}`);
    if (!res.ok) throw new Error("Failed to fetch employee");
    return res.json();
}

export async function createEmployee(employee) {
    const token = localStorage.getItem("token"); 
    const res = await fetch(`${BASE_URL}/employee/add`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(employee),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create employee");
    }

    return res.json();
}

export async function updateEmployee(id, employee) {
    const res = await fetch(`http://localhost:8000/employee/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error("Failed to update employee");
    return res.json();
}

export async function deleteEmployee(id) {
    const res = await fetch(`http://localhost:8000/employee/delete/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete employee");
    return res.json();
}

export function logout() {
    localStorage.removeItem("token"); 
}