'use strict';

const logger = require('../utils/logger');

const OWNER_TEXT = [
  '👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢',
  '',
  '👤 𝗡𝗮𝗺𝗲: 𝐒𝐞𝐥𝐢𝐦 𝐒𝐢𝐳𝐮 🦋',
  '🧸 𝗡𝗶𝗰𝗸 𝗡𝗮𝗺𝗲: 𝐒𝐢𝐳𝐮',
  '🎂 𝗔𝗴𝗲: 𝟭𝟴+',
  '💘 𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻: 𝗦𝗶𝗻𝗴𝗹𝗲',
  '🎓 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻: 𝗦𝘁𝘂𝗱𝗲𝗻𝘁',
  '📚 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻: 𝐇𝐒𝐂',
  '🏡 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: 𝐌𝐞𝐡𝐞𝐫𝐩𝐮𝐫',
  '',
  '🔗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧 𝗟𝗜𝗡𝗞𝗦',
  '',
  '📘 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸:',
  'fb.com/100075452558091',
  '',
  '💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿:',
  'm.me/100075452558091',
  '',
  '📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:',
  'wa.me/01618119633',
].join('\n');

// Photo links. Direct links like https://i.imgur.com/XXXXXXX.jpg work best.
// Imgur album links (https://imgur.com/a/XXXXXXX) are tried too,
// but Imgur may refuse the download. Only JPG images are supported.
const OWNER_PHOTOS = Array.from(
  new Set([
    'https://imgur.com/a/VroiOWg',
    'https://imgur.com/a/ngyqmc2',
    // Add your third photo link on a new line, for example:
    // 'https://i.imgur.com/XXXXXXX.jpg',
  ])
);

const MAX_BYTES = 8 * 1024 * 1024;
const TIMEOUT_MS = 15000;

const cache = new Map();
let lastIndex = -1;

function request(url) {
  return fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SALIM-IG-GC-BOT)' },
  });
}

// Turns an Imgur album/gallery link into a direct image link.
async function resolveDirectUrl(url) {
  if (!/^https?:\/\/(www\.)?imgur\.com\/(a|gallery)\//i.test(url)) {
    return url;
  }

  const res = await request(url);
  if (!res.ok) {
    throw new Error(`Imgur page returned HTTP ${res.status}`);
  }

  const html = await res.text();
  const match =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);

  if (!match) {
    throw new Error('No direct image link found on the Imgur page');
  }

  const direct = match[1].split('?')[0];
  if (!/^https:\/\/i\.imgur\.com\//i.test(direct)) {
    throw new Error('Unexpected image host');
  }
  return direct;
}

async function downloadPhoto(url) {
  if (cache.has(url)) return cache.get(url);

  const direct = await resolveDirectUrl(url);
  const res = await request(direct);
  if (!res.ok) {
    throw new Error(`Image download returned HTTP ${res.status}`);
  }

  const type = String(res.headers.get('content-type') || '').toLowerCase();
  if (!type.startsWith('image/jpeg')) {
    throw new Error(`Only JPG images are supported (got "${type || 'unknown'}")`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    throw new Error('Image is too large (maximum 8 MB)');
  }

  cache.set(url, buffer);
  return buffer;
}

function nextStartIndex() {
  const count = OWNER_PHOTOS.length;
  if (count <= 1) return 0;

  let index = Math.floor(Math.random() * count);
  if (index === lastIndex) {
    index = (index + 1) % count;
  }
  lastIndex = index;
  return index;
}

module.exports = {
  name: 'owner',
  aliases: ['ownerinfo', 'owners', 'dev', 'credit'],
  version: '1.0.0',
  credits: 'Selim Sizu',
  description: 'Show the bot owner information with a photo',
  usage: 'owner',
  permission: 'everyone',
  category: 'Owner',

  async execute(ctx) {
    const canSendPhoto =
      typeof ctx.replyPhoto === 'function' && OWNER_PHOTOS.length > 0;

    if (canSendPhoto) {
      const count = OWNER_PHOTOS.length;
      const start = nextStartIndex();

      for (let i = 0; i < count; i += 1) {
        const url = OWNER_PHOTOS[(start + i) % count];

        let photo;
        try {
          photo = await downloadPhoto(url);
        } catch (err) {
          logger.warn('Owner photo skipped:', url, '-', err.message);
          continue;
        }

        try {
          await ctx.replyPhoto(photo);
        } catch (err) {
          logger.warn('Could not send owner photo:', err.message);
        }
        break;
      }
    }

    await ctx.reply(OWNER_TEXT);
  },
};
