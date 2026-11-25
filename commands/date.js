'use strict';

const { box, formatDate } = require('../utils/format');

module.exports = {
  name: 'date',
  aliases: [],
  description: 'Show the current Bangladesh date',
  usage: 'date',
  permission: 'everyone',
  category: 'Utility',

  async execute(ctx) {
    await ctx.reply(
      box('DATE 📅', [
        `Bangladesh Date: ${formatDate()}`,
        'Timezone: Asia/Dhaka (GMT+6)',
      ])
    );
  },
};
