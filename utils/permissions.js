'use strict';

const config = require('../config');

const LEVEL = Object.freeze({
  EVERYONE: 'everyone',
  ADMIN: 'admin',
  OWNER: 'owner',
});

const DENY_MESSAGES = Object.freeze({
  owner: '⛔ This command is only for Bot Owner!',
  admin: '⛔ Only Group Admin can use this command!',
});

// Accepts: "everyone", "admin", "owner" (also "group admin", "bot owner").
// Unknown values become "owner" (the safest, most restricted level).
function normalize(permission) {
  const value = String(permission || LEVEL.EVERYONE)
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, '');

  if (value === 'everyone') return LEVEL.EVERYONE;
  if (value === 'admin' || value === 'groupadmin') return LEVEL.ADMIN;
  if (value === 'owner' || value === 'botowner') return LEVEL.OWNER;
  return LEVEL.OWNER;
}

function isOwner(sender) {
  const username = String((sender && sender.username) || '')
    .toLowerCase()
    .replace(/^@/, '');
  if (!username) return false;
  return config.owner.usernames.includes(username);
}

// ctx.thread.adminIds is filled by the connection module.
// If the admin list is not available, we do NOT guess: we return false.
function isGroupAdmin(ctx) {
  const adminIds = ctx && ctx.thread && ctx.thread.adminIds;
  if (!Array.isArray(adminIds)) return false;

  const senderId = String((ctx.sender && ctx.sender.id) || '');
  if (!senderId) return false;

  return adminIds.map(String).includes(senderId);
}

// Returns { allowed: true } or { allowed: false, message: '...' }
function check(permission, ctx) {
  const level = normalize(permission);
  const sender = ctx && ctx.sender;

  if (level === LEVEL.EVERYONE) {
    return { allowed: true };
  }

  if (level === LEVEL.OWNER) {
    return isOwner(sender)
      ? { allowed: true }
      : { allowed: false, message: DENY_MESSAGES.owner };
  }

  // Admin level: Bot Owner is always allowed too.
  if (isOwner(sender) || isGroupAdmin(ctx)) {
    return { allowed: true };
  }
  return { allowed: false, message: DENY_MESSAGES.admin };
}

module.exports = {
  LEVEL,
  normalize,
  isOwner,
  isGroupAdmin,
  check,
};
