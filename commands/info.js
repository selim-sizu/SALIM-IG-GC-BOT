'use strict';

const config = require('../config');
const { box } = require('../utils/format');

module.exports = {
  name: 'info',
  aliases: [],
  description: 'Show bot information',
  usage: 'info',
  permission: 'everyone',
  category: 'General',

  async execute(ctx) {
    const total =
      ctx.bot && ctx.bot.commands ? ctx.bot.commands.size : 0;

    await ctx.reply(
      box('BOT INFO 🤖', [
        `Name: ${config.bot.name}`,
        `Version: ${config.bot.version}`,
        `Developer: ${config.bot.developer}`,
        `Prefix: ${ctx.prefix}`,
        `Commands: ${total}`,
        `Runtime: Node.js ${process.version}`,
        'Library: instagram-private-api + instagram_mqtt',
        `Timezone: ${config.timezone}`,
      ])
    );
  },
};
