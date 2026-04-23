const {
  createExpense,
  getExpenses,
  deleteAllExpenses,
} = require("../services/expenseService");

async function createExpenseController(req, res) {
  const idempotencyKey = req.header("Idempotency-Key");
  const result = await createExpense(req.body, idempotencyKey);
  res.status(result.statusCode).json(result.data);
}

async function deleteAllExpensesController(req, res) {
  const result = await deleteAllExpenses();

  res.status(result.statusCode).json(result.data);
}

async function getExpensesController(req, res) {
  const result = await getExpenses(req.query);
  res.json(result);
}

module.exports = {
  createExpenseController,
  getExpensesController,
  deleteAllExpensesController
};
