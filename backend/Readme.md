# Expense Tracker Backend

A minimal Node.js + Express + SQLite backend for an expense tracker.

## Why SQLite?

I chose SQLite because it provides real persistence with almost no setup, while still supporting constraints and transactions. That makes it a good fit for a small assignment that still needs production-like correctness.

## Key design decisions

- **Money is stored as integer paise** (`amount_paise`) instead of floating point to avoid precision issues.
- **Idempotent POST /expenses** is implemented using an `Idempotency-Key` header plus a stored request hash.
- **SQLite transaction** is used during create flow so retries do not create duplicate expenses.
- **Date** is stored as `YYYY-MM-DD` for predictable sorting/filtering.
- API returns `amount` and `total` as decimal strings like `"123.45"`.

## Trade-offs

- Authentication is not included.
- Category values are free-text instead of normalized into a separate table.
- The idempotency store does not expire old keys yet.
- SQLite is enough for this exercise, but for larger scale I would likely move to PostgreSQL.

## Endpoints

### POST /expenses

Headers:

- `Content-Type: application/json`
- `Idempotency-Key: any-unique-client-generated-value`

Body:

```json
{
  "amount": "250.50",
  "category": "Food",
  "description": "Lunch",
  "date": "2026-04-23"
}

