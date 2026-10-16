import { getSession, setSession } from "./authStorage.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const session = getSession();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("The API returned an invalid response. Check that the API server is running.");
  }
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "The request could not be completed.");
  }
  return result;
}

export async function registerUser(values) {
  const { confirmPassword, terms, ...payload } = values;
  const result = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.user;
}

export async function loginUser(values) {
  const result = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(values),
  });
  return setSession({ ...result.user, token: result.token });
}

export function getMembers() {
  return request("/members");
}
