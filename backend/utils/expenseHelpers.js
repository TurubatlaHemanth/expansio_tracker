const crypto = require("crypto");
const AppError = require("./AppError");

function generateId() {
  return crypto.randomUUID();
}

function normalizeCategory(value) {
  return String(value || "").trim();
}

function normalizeDescription(value) {
  return String(value || "").trim();
}

function isValidDateOnly(value) {
  if (typeof value !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return false;

  return date.toISOString().slice(0, 10) === value;
}

function parseAmountToPaise(amount) {
  if (amount === null || amount === undefined || amount === "") {
    throw new AppError(400, "Validation failed", ["Amount is required"]);
  }

  const str = String(amount).trim();

  if (!/^\d+(\.\d{1,2})?$/.test(str)) {
    throw new AppError(400, "Validation failed", [
      "Amount must be a valid non-negative number with up to 2 decimal places"
    ]);
  }

  const [whole, fractional = ""] = str.split(".");
  const paise = Number(whole) * 100 + Number((fractional + "00").slice(0, 2));

  if (!Number.isSafeInteger(paise) || paise < 0) {
    throw new AppError(400, "Validation failed", ["Amount is invalid"]);
  }

  return paise;
}

function formatPaiseToAmount(paise) {
  return (paise / 100).toFixed(2);
}

function validateExpenseInput(body) {
  const errors = [];
  let amountPaise;

  try {
    amountPaise = parseAmountToPaise(body.amount);
  } catch (err) {
    if (err.details) {
      errors.push(...err.details);
    } else {
      errors.push(err.message);
    }
  }

  const category = normalizeCategory(body.category);
  const description = normalizeDescription(body.description);
  const date = body.date;

  if (!category) errors.push("Category is required");
  if (!description) errors.push("Description is required");
  if (!isValidDateOnly(date)) errors.push("Date must be a valid YYYY-MM-DD value");

  if (errors.length > 0) {
    throw new AppError(400, "Validation failed", errors);
  }

  return {
    amountPaise,
    category,
    description,
    date
  };
}

function hashRequestPayload(payload) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}

function toExpenseResponse(row) {
  return {
    id: row.id,
    amount: formatPaiseToAmount(row.amount_paise),
    category: row.category,
    description: row.description,
    date: row.date,
    created_at: row.created_at
  };
}

module.exports = {
  generateId,
  normalizeCategory,
  normalizeDescription,
  isValidDateOnly,
  parseAmountToPaise,
  formatPaiseToAmount,
  validateExpenseInput,
  hashRequestPayload,
  toExpenseResponse
};
