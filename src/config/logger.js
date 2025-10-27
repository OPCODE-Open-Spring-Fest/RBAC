import { createLogger, format, transports } from "winston";
import path from "path";

const { combine, timestamp, printf, colorize, errors, json } = format;

// === Custom log format for console ===
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} | ${level}: ${stack || message}`;
});

// === File path for logs ===
const logDir = "logs";
const errorFile = path.join(logDir, "error.log");
const combinedFile = path.join(logDir, "combined.log");

// === Winston Logger Instance ===
const logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
  transports: [
    new transports.File({ filename: combinedFile }),
    new transports.File({ filename: errorFile, level: "error" }),
  ],
});

// === Add colorized console output in dev mode ===
if (process.env.NODE_ENV === "development") {
  logger.add(
    new transports.Console({
      format: combine(colorize(), consoleFormat),
    })
  );
} else {
  logger.add(
    new transports.Console({
      format: combine(json()),
    })
  );
}

// 🧩 Optional: Add HTTP Level Support
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export default logger;