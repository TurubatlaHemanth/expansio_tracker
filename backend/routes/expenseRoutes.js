const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  createExpenseController,
  getExpensesController,
  deleteAllExpensesController
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/", asyncHandler(createExpenseController));
router.get("/", asyncHandler(getExpensesController));
router.delete("/", asyncHandler(deleteAllExpensesController));


module.exports = router;
