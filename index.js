import express from "express";

const app = express();

/* ---------------- LOGGER ---------------- */
function log(level, component, msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level}] [${component}] ${msg}`);
}

/* ---------------- CONFIG ---------------- */
function loadConfig() {
  log("INFO", "Config", "Loading environment variables");

  for (let i = 0; i < 40; i++) {
    log("DEBUG", "Config", `Reading env var index=${i}`);
  }

  if (!process.env.PAYMENTS_API_KEY) {
    log("FATAL", "Config", "PAYMENTS_API_KEY is missing");
    throw new Error("PAYMENTS_API_KEY not set");
  }

  log("INFO", "Config", "PAYMENTS_API_KEY loaded");

  return {
    paymentsKey: process.env.PAYMENTS_API_KEY,
  };
}

/* ---------------- DB ---------------- */
async function connectToDatabase() {
  log("INFO", "DB", "Connecting to PostgreSQL");

  for (let i = 1; i <= 10; i++) {
    log("INFO", "DB", `Connection attempt ${i}`);
    await delay(100);
  }

  for (let i = 0; i < 80; i++) {
    log("DEBUG", "DB", `Handshake packet ${i} acknowledged`);
  }

  log("INFO", "DB", "Database connected");
}

/* ---------------- CACHE ---------------- */
async function warmCache() {
  log("INFO", "Cache", "Warming cache");

  for (let i = 0; i < 120; i++) {
    log("DEBUG", "Cache", `Loaded cache key=user:${i}`);
  }

  log("WARN", "Cache", "TTL mismatch on some keys");
}

/* ---------------- WORKER ---------------- */
function startWorker() {
  log("INFO", "Worker", "Starting background worker");

  setInterval(() => {
    for (let i = 0; i < 5; i++) {
      log("DEBUG", "Worker", `Polling job queue shard=${i}`);
    }
  }, 200);
}

/* ---------------- SERVICE ---------------- */
function processPayment(amount, config) {
  log("INFO", "Payments", "Processing payment");
  log("DEBUG", "Payments", `Amount=${amount}`);

  for (let i = 0; i < 30; i++) {
    log("DEBUG", "Payments", `Validating rule_${i}`);
  }

  if (!config.paymentsKey) {
    throw new Error("Payments API key not configured");
  }

  log("INFO", "Payments", "Payment processed");
  return { status: "success" };
}

/* ---------------- HTTP ---------------- */
app.get("/", async (req, res) => {
  try {
    log("INFO", "HTTP", "Incoming GET / request");

    for (let i = 0; i < 50; i++) {
      log("DEBUG", "HTTP", `Header parse step ${i}`);
    }

    await delay(200);

    log("INFO", "HTTP", "Calling payment service");

    const result = processPayment(499, app.locals.config);
    res.json(result);
  } catch (err) {
    log("ERROR", "HTTP", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ---------------- STARTUP ---------------- */
async function startApp() {
  log("INFO", "App", "Starting application");

  for (let i = 0; i < 60; i++) {
    log("DEBUG", "App", `Bootstrapping module_${i}`);
  }

  app.locals.config = loadConfig();
  await connectToDatabase();
  await warmCache();
  startWorker();

  app.listen(3000, () => {
    log("INFO", "App", "Server listening on port 3000");
  });
}

/* ---------------- UTILS ---------------- */
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/* ---------------- RUN ---------------- */
startApp().catch((err) => {
  log("FATAL", "App", err.message);
  process.exit(1);
});
