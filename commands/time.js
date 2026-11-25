'use strict';

const { box, formatTime } = require('../utils/format');

module.exports = {
  name: 'time',
  aliases: [],
  description: 'Show the current Bangladesh time',
  usage: 'time',
  permission: 'everyone',
  category: 'Utility',

  async execute(ctx) {
    await ctx.reply(
      box('TIME ⏰', [
        `Bangladesh Time: ${formatTime()}`,
        'Timezone: Asia/Dhaka (GMT+6)',
      ])
    );
  },
};
