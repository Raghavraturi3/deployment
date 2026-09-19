const API_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

export async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  });
}