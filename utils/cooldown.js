'use strict';

// key -> time (in milliseconds) when the cooldown ends
const store = new Map();

const CLEANUP_INTERVAL_MS = 60 * 1000;
const MAX_ENTRIES = 5000;

function remaining(key) {
  const expiresAt = store.get(key);
  if (!expiresAt) return 0;

  const left = expiresAt - Date.now();
  if (left <= 0) {
    store.delete(key);
    return 0;
  }
  return Math.ceil(left / 1000);
}

// Returns 0 if the action is allowed (and starts a new cooldown).
// Returns the number of seconds left if the user must wait.
function consume(key, seconds) {
  const left = remaining(key);
  if (left > 0) return left;

  if (seconds > 0) {
    store.set(key, Date.now() + seconds * 1000);
  }
  return 0;
}

function reset(key) {
  store.delete(key);
}

function cleanup() {
  const now = Date.now();
  for (const [key, expiresAt] of store.entries()) {
    if (expiresAt <= now) {
      store.delete(key);
    }
  }
}

const timer = setInterval(() => {
  cleanup();
  if (store.size > MAX_ENTRIES) {
    store.clear();
  }
}, CLEANUP_INTERVAL_MS);

if (typeof timer.unref === 'function') {
  timer.unref();
}

module.exports = {
  consume,
  remaining,
  reset,
  size: () => store.size,
};
