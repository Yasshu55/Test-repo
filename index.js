import express from "express";

const app = express();

/* -------- Logger -------- */
function log(level, component, msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level}] [${component}] ${msg}`);
}

/* -------- Config -------- */
function loadConfig() {
  log("INFO", "Config", "Loading environment variables");

  if (!process.env.PAYMENTS_API_KEY) {
    log("FATAL", "Config", "PAYMENTS_API_KEY is missing");
    throw new Error("PAYMENTS_API_KEY not set");
  }

  log("INFO", "Config", "PAYMENTS_API_KEY loaded");

  return {
    paymentsKey: process.env.PAYMENTS_API_KEY,
  };
}

/* -------- Fake DB -------- */
async function connectToDatabase() {
  log("INFO", "DB", "Connecting to database");

  for (let i = 1; i <= 5; i++) {
    log("INFO", "DB", `Connection attempt ${i}`);
    await delay(200);
  }

  log("INFO", "DB", "Database connected");
}

/* -------- Service -------- */
function processPayment(amount, config) {
  log("INFO", "Payments", "Processing payment");
  log("DEBUG", "Payments", `Amount=${amount}`);

  if (!config.paymentsKey) {
    throw new Error("Payments API key not configured");
  }

  return { status: "success" };
}

/* -------- HTTP -------- */
app.get("/", async (req, res) => {
  try {
    log("INFO", "HTTP", "GET / request");

    await delay(300);

    const result = processPayment(499, app.locals.config);
    res.json(result);
  } catch (err) {
    log("ERROR", "HTTP", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* -------- Startup -------- */
async function startApp() {
  log("INFO", "App", "Starting app");

  app.locals.config = loadConfig();

  await connectToDatabase();

  app.listen(3000, () => {
    log("INFO", "App", "Server listening on port 3000");
  });
}

/* -------- Utils -------- */
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/* -------- Run -------- */
startApp().catch((err) => {
  log("FATAL", "App", err.message);
  process.exit(1);
});
