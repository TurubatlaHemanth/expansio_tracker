require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initDb } = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
const jsonErrorHandler = require("./middleWare/jsonErrorHandler");
const notFound = require("./middleWare/notFound");
const errorHandler = require("./middleWare/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: ["https://expansio-tracker.onrender.com","http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(jsonErrorHandler);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/expenses", expenseRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
