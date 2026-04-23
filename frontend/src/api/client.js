const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "[localhost](http://localhost:4000)";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {})
    }
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      data?.details?.join(", ") ||
      data?.error ||
      "Something went wrong";

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
