import { apiRequest } from "./client";

function toQueryString(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getExpenses({ category = "", sort = "date_desc" } = {}) {
  const query = toQueryString({ category, sort });
  return apiRequest(`/expenses${query}`, {
    method: "GET"
  });
}

export async function createExpense(payload, idempotencyKey) {
  return apiRequest("/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify(payload)
  });
}
