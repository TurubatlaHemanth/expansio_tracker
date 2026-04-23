const { run, get, all, exec } = require("../config/db");
const AppError = require("../utils/AppError");
const {
  generateId,
  validateExpenseInput,
  hashRequestPayload,
  toExpenseResponse,
  formatPaiseToAmount
} = require("../utils/expenseHelpers");

async function createExpense(body, idempotencyKey) {
  const normalized = validateExpenseInput(body);

  if (!idempotencyKey || !idempotencyKey.trim()) {
    throw new AppError(400, "Idempotency-Key header is required");
  }

  const safeKey = idempotencyKey.trim();

  const requestPayload = {
    amountPaise: normalized.amountPaise,
    category: normalized.category,
    description: normalized.description,
    date: normalized.date
  };

  const requestHash = hashRequestPayload(requestPayload);

  try {
    await exec("BEGIN IMMEDIATE TRANSACTION");

    const existingKey = await get(
      `
      SELECT idempotency_key, expense_id, request_hash
      FROM idempotency_keys
      WHERE idempotency_key = ?
      `,
      [safeKey]
    );

    // Same key already exists
    if (existingKey) {
      // Same key, but different payload -> conflict
      if (existingKey.request_hash !== requestHash) {
        await exec("ROLLBACK");
        throw new AppError(
          409,
          "This Idempotency-Key was already used with a different request payload"
        );
      }

      // Same key, same payload -> return previous response, no duplicate insert
      const existingExpense = await get(
        `
        SELECT id, amount_paise, category, description, date, created_at
        FROM expenses
        WHERE id = ?
        `,
        [existingKey.expense_id]
      );

      await exec("COMMIT");

      return {
        statusCode: 200,
        data: {
          expense: toExpenseResponse(existingExpense),
          idempotentReplay: true
        }
      };
    }

    const expenseId = generateId();
    const now = new Date().toISOString();

    await run(
      `
      INSERT INTO expenses (id, amount_paise, category, description, date, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        expenseId,
        normalized.amountPaise,
        normalized.category,
        normalized.description,
        normalized.date,
        now
      ]
    );

    await run(
      `
      INSERT INTO idempotency_keys (idempotency_key, expense_id, request_hash, created_at)
      VALUES (?, ?, ?, ?)
      `,
      [safeKey, expenseId, requestHash, now]
    );

    await exec("COMMIT");

    const createdExpense = await get(
      `
      SELECT id, amount_paise, category, description, date, created_at
      FROM expenses
      WHERE id = ?
      `,
      [expenseId]
    );

    return {
      statusCode: 201,
      data: {
        expense: toExpenseResponse(createdExpense),
        idempotentReplay: false
      }
    };
  } catch (err) {
    try {
      await exec("ROLLBACK");
    } catch (_) {
      // ignore rollback failure
    }

    if (err.isOperational) {
      throw err;
    }

    throw new AppError(500, "Failed to create expense");
  }
}

async function getExpenses(query) {
  const { category, sort } = query;

  if (sort && sort !== "date_desc") {
    throw new AppError(400, "Invalid sort value. Supported: date_desc");
  }

  const whereClauses = [];
  const params = [];

  if (category && String(category).trim()) {
    whereClauses.push("category = ?");
    params.push(String(category).trim());
  }

  let sql = `
    SELECT id, amount_paise, category, description, date, created_at
    FROM expenses
  `;

  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(" AND ")}`;
  }

  if (sort === "date_desc") {
    sql += ` ORDER BY date DESC, created_at DESC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }

  try {
    const rows = await all(sql, params);
    const expenses = rows.map(toExpenseResponse);
    const totalPaise = rows.reduce((sum, row) => sum + row.amount_paise, 0);

    return {
      expenses,
      total: formatPaiseToAmount(totalPaise)
    };
  } catch (err) {
    throw new AppError(500, "Failed to fetch expenses");
  }
}


async function deleteAllExpenses() {
  try {
    await exec("BEGIN IMMEDIATE TRANSACTION");

    // check if records exist
    const existingRecords = await get(`
      SELECT COUNT(*) AS total
      FROM expenses
    `);

    if (!existingRecords || existingRecords.total === 0) {
      await exec("ROLLBACK");

      throw new AppError(404, "No expense records found to delete");
    }

    // delete all idempotency keys first
    await run(`
      DELETE FROM idempotency_keys
    `);

    // delete all expenses
    await run(`
      DELETE FROM expenses
    `);

    await exec("COMMIT");

    return {
      statusCode: 200,
      data: {
        message: "All expense records deleted successfully"
      }
    };
  } catch (err) {
    try {
      await exec("ROLLBACK");
    } catch (_) {
      // ignore rollback failure
    }

    if (err.isOperational) {
      throw err;
    }

    throw new AppError(500, "Failed to delete all expenses");
  }
}
module.exports = {
  createExpense,
  getExpenses,
  deleteAllExpenses
};
