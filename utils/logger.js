'use strict';

const config = require('../config');

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

const envLevel = String(process.env.LOG_LEVEL || 'info').toLowerCase();
const currentLevel = envLevel in LEVELS ? LEVELS[envLevel] : LEVELS.info;

function timestamp() {
  try {
    return new Date().toLocaleString('en-GB', {
      timeZone: config.timezone,
      hour12: false,
    });
  } catch (err) {
    return new Date().toISOString();
  }
}

function stringify(args) {
  return args
    .map((item) => {
      if (item instanceof Error) {
        return item.stack || item.message;
      }
      if (typeof item === 'object' && item !== null) {
        try {
          return JSON.stringify(item);
        } catch (err) {
          return String(item);
        }
      }
      return String(item);
    })
    .join(' ');
}

function write(level, args) {
  if (LEVELS[level] < currentLevel) return;

  const line = `[${timestamp()}] [${level.toUpperCase()}] ${stringify(args)}`;

  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

module.exports = {
  debug: (...args) => write('debug', args),
  info: (...args) => write('info', args),
  warn: (...args) => write('warn', args),
  error: (...args) => write('error', args),
};
