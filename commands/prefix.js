'use strict';

const { box } = require('../utils/format');

module.exports = {
  name: 'prefix',
  aliases: [],
  description: 'Show the current command prefix',
  usage: 'prefix',
  permission: 'everyone',
  category: 'General',

  async execute(ctx) {
    await ctx.reply(
      box('PREFIX 🔰', [
        `Current prefix: ${ctx.prefix}`,
        `Example: ${ctx.prefix}help`,
      ])
    );
  },
};
