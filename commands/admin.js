'use strict';

const { box, formatDate, formatTime, truncate } = require('../utils/format');

// ---------- !admin : Owner Details card ----------

function buildOwnerCard() {
  const updated = `${formatDate()} | ${formatTime()}`;

  return [
    '┌───────────────⭓',
    '│ 𝗢𝗪𝗡𝗘𝗥 𝗗𝗘𝗧𝗔𝗜𝗟𝗦',
    '├───────────────',
    '│👤 𝐍𝐚𝐦𝐞 : 𝐒𝐞𝐥𝐢𝐦 𝐒𝐢𝐳𝐮 🦋',
    '│🚹 𝐆𝐞𝐧𝐝𝐞𝐫 : 𝐌𝐚𝐥𝐞',
    '│❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 : 𝐒𝐢𝐧𝐠𝐥𝐞',
    '│🎂 𝐀𝐠𝐞 : 𝟏𝟖+',
    '│🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 : 𝐈𝐬𝐥𝐚𝐦',
    '│🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : 𝐇𝐒𝐂',
    '│🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬 : 𝐌𝐞𝐡𝐞𝐫𝐩𝐮𝐫',
    '└───────────────⭓',
    '',
    '┌───────────────⭓',
    '│ 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦',
    '├───────────────',
    '│📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:',
    '│https://fb.com/100075452558091',
    '│💬 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:',
    '│https://wa.me/01618119633',
    '└───────────────⭓',
    '',
    '┌───────────────⭓',
    '│ 🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗧𝗶𝗺𝗲',
    '├───────────────',
    `│ ${updated}`,
    '└───────────────⭓',
  ].join('\n');
}

const adminCommand = {
  name: 'admin',
  aliases: [],
  description: 'Show the owner details card',
  usage: 'admin',
  permission: 'everyone',
  category: 'Admin',

  async execute(ctx) {
    await ctx.reply(buildOwnerCard());
  },
};

// ---------- !groupinfo ----------

const groupInfoCommand = {
  name: 'groupinfo',
  aliases: [],
  description: 'Show detailed information about this group',
  usage: 'groupinfo',
  permission: 'admin',
  category: 'Admin',

  async execute(ctx) {
    const thread = ctx.thread || {};

    if (!thread.isGroup) {
      await ctx.reply('ℹ️ This command works in group chats only.');
      return;
    }

    const members = Array.isArray(thread.users)
      ? String(thread.users.length)
      : 'Not available';
    const admins = Array.isArray(thread.adminIds)
      ? String(thread.adminIds.length)
      : 'Not available';

    await ctx.reply(
      box('GROUP INFO 👥', [
        `Name: ${thread.title || 'Not available'}`,
        `Thread ID: ${thread.id || 'Not available'}`,
        `Members (without bot): ${members}`,
        `Admins: ${admins}`,
      ])
    );
  },
};

// ---------- !warn ----------

const WARN_LIMIT = 3;

// Warnings are kept in memory only. They reset when the bot restarts.
const warnings = new Map();

const warnCommand = {
  name: 'warn',
  aliases: [],
  description: 'Give a warning to a member',
  usage: 'warn <username> [reason]',
  permission: 'admin',
  category: 'Admin',

  async execute(ctx) {
    const target = String(ctx.args[0] || '')
      .replace(/^@/, '')
      .toLowerCase();

    if (!/^[a-z0-9._]{1,30}$/.test(target)) {
      await ctx.reply(`Usage: ${ctx.prefix}warn <username> [reason]`);
      return;
    }

    const reason = ctx.args.slice(1).join(' ').trim() || 'No reason given';
    const key = `${(ctx.thread && ctx.thread.id) || 'unknown'}:${target}`;
    const count = (warnings.get(key) || 0) + 1;
    warnings.set(key, count);

    const lines = [
      `User: @${target}`,
      `Reason: ${truncate(reason, 100)}`,
      `Warnings: ${count}/${WARN_LIMIT}`,
    ];

    if (count >= WARN_LIMIT) {
      lines.push('🚨 Limit reached! Admins, please take action.');
    } else {
      lines.push('Please follow the group rules.');
    }

    await ctx.reply(box('WARNING ⚠️', lines));
  },
};

module.exports = [adminCommand, groupInfoCommand, warnCommand];
