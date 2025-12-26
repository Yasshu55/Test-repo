import express from 'express';

const app = express();

/**
 * Fake logger to spam logs
 */
function noisyLog(step, message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [STEP-${step}] ${message}`);
}

/**
 * Simulate deep service call
 */
function calculateBusinessLogic(input) {
  noisyLog(3, "Starting business logic calculation");

  for (let i = 0; i < 100; i++) {
    noisyLog(3, `Processing intermediate value ${i}`);
  }

  // 💥 Intentional bug
  return undefinedFunctionCall(input);
}

/**
 * Controller
 */
app.get('/', async (req, res) => {
  noisyLog(1, "Received GET / request");
  noisyLog(1, "Validating request");

  for (let i = 0; i < 50; i++) {
    noisyLog(2, `Request validation step ${i}`);
  }

  noisyLog(2, "Calling service layer");

  const result = calculateBusinessLogic(42);

  res.send(`Result: ${result}`);
});

/**
 * App startup logs
 */
for (let i = 0; i < 80; i++) {
  noisyLog(0, `Bootstrapping module ${i}`);
}

app.listen(3000, () => {
  noisyLog(0, "Server started on port 3000");
});
