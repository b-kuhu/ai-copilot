export function logInfo(message, data = {}) {
  console.log(`[INFO] ${message}`, data);
}

export function logError(message, error) {
  console.error(`[ERROR] ${message}`, error);
}
