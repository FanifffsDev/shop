let token = "";

export async function authFetch(url, options = {}) {
    if (!token) return;

    const headers = {
      ...(options.headers || {}),
      Authorization: `tma ${token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, { ...options, headers });
    return response;
};

export function setToken(newToken) {
  token = newToken;
};

export function getToken() {
  return token;
};