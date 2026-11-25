'use strict';

const { box } = require('../utils/format');

const DEFAULT_RULES = [
  '1. Respect everyone 🤝',
  '2. No spam or flooding 🚫',
  '3. No abusive or hateful language ❌',
  '4. Do not share personal information 🔒',
  '5. Listen to the group admins 👑',
  '6. Use bot commands properly 🤖',
];

// Rules can be changed from database/settings.json ("rules": ["...", "..."]).
// If that file or the list is missing, the default rules above are used.
function loadRules() {
  try {
    const settings = require('../database/settings.json');
    if (Array.isArray(settings.rules) && settings.rules.length > 0) {
      return settings.rules.map(String);
    }
  } catch (err) {
    // settings.json not found or invalid: use default rules
  }
  return DEFAULT_RULES;
}

module.exports = {
  name: 'rules',
  aliases: [],
  description: 'Show the group rules',
  usage: 'rules',
  permission: 'everyone',
  category: 'Group',

  async execute(ctx) {
    await ctx.reply(box('GROUP RULES 📜', loadRules()));
  },
};
