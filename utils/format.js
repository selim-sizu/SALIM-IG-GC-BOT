'use strict';

const config = require('../config');

// Builds a box like:
// ╭━━━〔 TITLE 〕
// ┃ line 1
// ┃ line 2
// ╰━━━━━━━━━━━━
function box(title, lines = []) {
  const header = `╭━━━〔 ${title} 〕`;
  const footer = '╰━━━━━━━━━━━━';

  const flat = (Array.isArray(lines) ? lines : [lines])
    .flatMap((line) => String(line).split('\n'))
    .map((line) => `┃ ${line}`.trimEnd());

  return [header, ...flat, footer].join('\n');
}

// 93784000 -> "1d 2h 3m 4s"
function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (days || hours) parts.push(`${hours}h`);
  if (days || hours || minutes) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
}

// Bangladesh time, example: "02:35:10 PM"
function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    timeZone: config.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

// Bangladesh date, example: "Wednesday 25 November 2026"
function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', {
    timeZone: config.timezone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function truncate(text, max) {
  const value = String(text);
  if (value.length <= max) return value;
  return value.slice(0, Math.max(0, max - 1)) + '…';
}

function randomItem(list) {
  if (!Array.isArray(list) || list.length === 0) return undefined;
  return list[Math.floor(Math.random() * list.length)];
}

module.exports = {
  box,
  formatDuration,
  formatTime,
  formatDate,
  truncate,
  randomItem,
};
