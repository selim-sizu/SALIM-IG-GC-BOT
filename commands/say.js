'use strict';

const config = require('../config');

module.exports = {
  name: 'say',
  aliases: [],
  description: 'Repeat the text you give',
  usage: 'say <text>',
  permission: 'everyone',
  category: 'Fun',

  async execute(ctx) {
    const text = ctx.args.join(' ').trim();

    if (!text) {
      await ctx.reply(`Usage: ${ctx.prefix}say <text>`);
      return;
    }

    const max = config.commands.maxSayLength;
    if (text.length > max) {
      await ctx.reply(`⚠️ Text is too long. Maximum ${max} characters allowed.`);
      return;
    }

    await ctx.reply(text);
  },
};
