'use strict';

const config = require('../config');
const cooldown = require('../utils/cooldown');
const permissions = require('../utils/permissions');

const COOLDOWN_SECONDS = 15;

// Replies when someone tags the owner. Add or change lines freely.
const REPLIES = [
  '🐸 চিপা থেকে বের হও! 😄',
  'বস এখন বিজি আছে, আমাকে বলো কী লাগবে 😎',
  'বারবার ট্যাগ দিলে বস রেগে যাবে কিন্তু 😏',
  'বসকে ডাকছো কেন? আগে আমাকে বলো 🤖',
  'এত ট্যাগ করো না, বসের নোটিফিকেশন ভরে যাবে 🔔😂',
  'আমি আছি তো! বসকে কষ্ট দিও না 😚',
  'বস এলে জানিয়ে দেব, একটু ধৈর্য ধরো 🫶',
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Matches "@username" for every owner username in config.js
const patterns = config.owner.usernames.map(
  (username) =>
    new RegExp(`(^|[^a-z0-9._])@${escapeRegExp(username)}(?![a-z0-9._])`, 'i')
);

function mentionsOwner(text) {
  const value = String(text || '');
  return patterns.some((pattern) => pattern.test(value));
}

let lastIndex = -1;

function pickReply() {
  if (REPLIES.length === 1) return REPLIES[0];

  let index = Math.floor(Math.random() * REPLIES.length);
  if (index === lastIndex) {
    index = (index + 1) % REPLIES.length;
  }
  lastIndex = index;
  return REPLIES[index];
}

// Called by events/message.js for messages that are not commands.
// Returns true if the message tagged the owner.
async function handle(ctx) {
  if (!mentionsOwner(ctx.text)) return false;

  // The owner tagging himself gets no reply.
  if (permissions.isOwner(ctx.sender)) return false;

  const threadId = (ctx.thread && ctx.thread.id) || 'unknown';
  const senderId = (ctx.sender && ctx.sender.id) || 'unknown';
  const key = `mention:${threadId}:${senderId}`;

  const wait = cooldown.consume(key, COOLDOWN_SECONDS);
  if (wait > 0) return true;

  await ctx.reply(pickReply());
  return true;
}

module.exports = {
  name: 'mention',
  version: '1.0.0',
  credits: 'Selim Sizu',
  handle,
  mentionsOwner,
};
