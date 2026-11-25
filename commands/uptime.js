'use strict';

const { box, formatDuration } = require('../utils/format');

module.exports = {
  name: 'uptime',
  aliases: [],
  description: 'Show how long the bot has been running',
  usage: 'uptime',
  permission: 'everyone',
  category: 'General',

  async execute(ctx) {
    const runningMs = process.uptime() * 1000;

    await ctx.reply(
      box('UPTIME ⏱️', [`Running for: ${formatDuration(runningMs)}`])
    );
  },
};
