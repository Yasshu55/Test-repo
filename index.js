import express from "express";

const app = express();

/* ----------------------------- LOGGER ----------------------------- */
function log(level, component, msg) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level}] [${component}] ${msg}`);
}

/* ------------------------ BOOTSTRAP PHASE ------------------------- */
function loadConfig() {
  log("INFO", "Config", "Loading environment variables");
  log("INFO", "Config", "NODE_ENV=production");
  log("WARN", "Config", "FEATURE_X flag missing, defaulting to false");

  if (!process.env.PAYMENTS_API_KEY) {
    log("ERROR", "Config", "Required env PAYMENTS_API_KEY is missing");
  }

  return {
    paymentsKey: process.env.PAYMENTS_API_KEY,
  };
}

/* ------------------------ DATABASE LAYER -------------------------- */
async function connectToDatabase() {
  log("INFO", "DB", "Connecting to PostgreSQL");

  for (let i = 1; i <= 5; i++) {
    log("INFO", "DB", `Connection attempt ${i}`);
    await delay(200);
  }

  log("INFO", "DB", "Database connection established");
}

/* -------------------------- CACHE LAYER --------------------------- */
async function warmCache() {
  log("INFO", "Cache", "Warming Redis cache");

  for (let i = 0; i < 120; i++) {
    log("DEBUG", "Cache", `Preloading key user:${i}`);
  }

  log("WARN", "Cache", "Some cache keys skipped due to TTL mismatch");
}

/* ----------------------- BACKGROUND WORKER ------------------------ */
async function startBackgroundWorker() {
  log("INFO", "Worker", "Starting background job processor");

  setInterval(() => {
    log("DEBUG", "Worker", "Polling queue: size=0");
  }, 100);
}

/* ----------------------- SERVICE LAYER ----------------------------- */
function processPayment(amount, config) {
  log("INFO", "Payments", "Processing payment");
  log("DEBUG", "Payments", `Amount=${amount}`);

  if (!config.paymentsKey) {
    throw new Error("Payments API key not configured");
  }

  return { status: "success" };
}

/* ------------------------- HTTP LAYER ------------------------------ */
app.get("/", async (req, res) => {
  log("INFO", "HTTP", "Incoming request GET /");
  log("DEBUG", "HTTP", "Parsing headers");

  await delay(300);

  log("INFO", "HTTP", "Calling payment service");

  const result = processPayment(499, app.locals.config);

  res.json(result);
});

/* ------------------------- STARTUP ------------------------------- */
async function startApp() {
  log("INFO", "App", "Starting application");

  for (let i = 0; i < 50; i++) {
    log("DEBUG", "App", `Initializing module ${i}`);
  }

  app.locals.config = loadConfig();

  await connectToDatabase();
  await warmCache();
  await startBackgroundWorker();

  app.listen(3000, () => {
    log("INFO", "App", "Server listening on port 3000");
  });
}

/* -------------------------- UTILS -------------------------------- */
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/* -------------------------- RUN ---------------------------------- */
startApp().catch((err) => {
  log("FATAL", "App", err.message);
  process.exit(1);
});
