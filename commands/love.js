'use strict';

const { box, truncate } = require('../utils/format');

const LOVE_MESSAGES = [
  'Tumi amar WiFi er moto, tumi na thakle ami disconnected! 📶❤️',
  'Tumi amar chai er moto, shokale na peyle din shuru-i hoy na! ☕💕',
  'Tumi amar biryani er moto, tumi chhara kichu bhalo lage na! 🍛😍',
  'Tomar hashi dekhle amar phone er battery o full hoye jay! 🔋😄',
  'Ami tomake love kori... chocolate er cheye ektu kom! 🍫😜',
  'Tumi amar charger er moto, 1% e thakleo tomake khuje berai! 🔌💖',
  'Tomar jonno ami ekta pura Instagram story likhte pari, kintu post korbo na! 🥰',
  'Tumi amar life er sobcheye sundor notification! 🔔💘',
  'Tumi hoile amar Ctrl+S, tumi thakle sob kichu safe! 💾❤️',
  'Tomar sathe thakle time o bhule jai, ghori o confuse! ⏰😍',
];

let lastIndex = -1;

function pickMessage() {
  let index = Math.floor(Math.random() * LOVE_MESSAGES.length);
  if (index === lastIndex) {
    index = (index + 1) % LOVE_MESSAGES.length;
  }
  lastIndex = index;
  return LOVE_MESSAGES[index];
}

module.exports = {
  name: 'love',
  aliases: [],
  description: 'Send a funny romantic message',
  usage: 'love [name]',
  permission: 'everyone',
  category: 'Fun',

  async execute(ctx) {
    const name = truncate(ctx.args.join(' ').trim(), 30);
    const lines = [];

    if (name) {
      lines.push(`For: ${name}`);
    }
    lines.push(pickMessage());

    await ctx.reply(box('LOVE 💌', lines));
  },
};
