
---

## `backend/README.md`

```md
# ⚙️ Expensio Backend

Backend API for Expensio Expense Tracker.

Built with Node.js + Express + SQLite.

---

# 🚀 Features

- POST /expenses
- GET /expenses
- DELETE /expenses
- SQLite database
- Transaction-safe inserts
- Validation
- Error handling
- Retry-safe requests using Idempotency-Key

---

# 🛠 Tech Stack

- Node.js
- Express.js
- SQLite

---

# 📁 Folder Structure

```text
backend/
│── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── db/
│   └── app.js
│── package.json
