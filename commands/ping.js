'use strict';

const { box } = require('../utils/format');

module.exports = {
  name: 'ping',
  aliases: [],
  description: 'Show the bot response latency',
  usage: 'ping',
  permission: 'everyone',
  category: 'General',

  async execute(ctx) {
    const start = Date.now();
    await ctx.reply('🏓 Pinging...');
    const latency = Date.now() - start;

    await ctx.reply(
      box('PING 🏓', [
        `Response time: ${latency} ms`,
        '(time taken to send a message)',
      ])
    );
  },
};
