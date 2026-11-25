
'use strict';

const config = require('../config');
const cooldown = require('../utils/cooldown');
const { randomItem } = require('../utils/format');

// Add new replies here.
// Key = what the member writes (capital or small letters do not matter).
// Value = the reply. A value can also be a list: ['reply 1', 'reply 2']
// and the bot will pick one randomly.
const REPLIES = {
  'miss you': 'অরেক বেডারে Miss না করে xan মেয়ে হলে বস 𝗦𝗲𝗹𝗶𝗺 রে হাঙ্গা করো😶👻😘',
  'miss u too': 'হুম আমি ও তোমাকে Miss করি... কিন্তু সাহু বস বেশি করে 😏💖',
  'kiss de': 'কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬',
  'hi': 'এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵',
  'bc': 'SAME TO YOU😊',
  'pro': 'Khud k0o KYa LeGend SmJhTi Hai 😂',
  'good morning': 'GOOD MORNING দাত ব্রাশ করে খেয়ে নেও😚',
  'good night': 'Sweet Dream babu… তবে আগে 🌙 𝗦𝗲𝗹𝗶𝗺 🖤✨ বস কে GN বলে নিও 😏💤',
  'tor ball': '~ এখনো বাল উঠে নাই নাকি তোমার?? 🤖',
  'salim': 'উনি এখন কাজে বিজি আছে কি বলবেন আমাকে বলতে পারেন..!😘',
  'owner': '[𝐎𝐖𝐍𝐄𝐑:☞ 𓆩🧸𓆪 𝗦𝗲𝗹𝗶𝗺 𝗦𝗶𝘇𝘂 🦋🥂 ☜\nFacebook: https://www.facebook.com/profile.php?id=100075452558091\nWhatsApp: +8801618119633',
  'admin': 'He is 𝗦𝗲𝗹𝗶𝗺 𝗦𝗶𝘇𝘂 🥂 তাকে সবাই Admin 𝗦𝗶𝘇𝘂 হিসেবে চিনে😘☺️',
  'babi': 'এ তো হাছিনা হে মেরে দিলকি দারকান হে মেরি জান হে😍.',
  'chup': 'তুই চুপ চুপ কর পাগল ছাগল',
  'Assalamualaikum': 'Walaikumassalam❤️‍🩹',
  'fork': 'https://gitlab.com/shahadat-sahu/SHAHADAT-CHAT-BOT.git',
  'kiss me': 'তুমি পঁচা তোমাকে কিস দিবো না 🤭',
  'thanks': 'এতো ধন্যবাদ না দিয়ে আমার বস 𝗦𝗲𝗹𝗶𝗺 রে তোর গার্লফ্রেন্ড টা দিয়ে দে..!🐸🥵',
  'i love you': 'মেয়ে হলে আমার বস 𝗦𝗲𝗹𝗶𝗺 এর ইনবক্সে এখুনি গুঁতা দিন🫢😻',
  'love you': 'ভালোবাসা নামক আবলামী করতে চাইলে Boss সাহু এর ইনবক্সে গুতা দিন 😘',
  'by': 'কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি..!🌚🌶️',
  'ami salim': 'হ্যা বস কেমন আছেন..?☺️',
  'bot er baccha': 'আমার বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️',
  'tor nam ki': 'MY NAME IS ─꯭─⃝‌‌𝗦𝗲𝗹𝗶𝗺 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁 🦋',
  'pic de': 'এন থেকে সর দুরে গিয়া মর😒',
  'cudi': 'এত চোদা চুদি করস কেনো..!🥱🌝🌚',
  'heda': 'এতো রাগ শরীরের জন্য ভালো না 🥰',
  'lol': 'ভাই তুই এত হাসিস না..!🌚🤣',
  'kire ki koros': 'তোমার কথা ভাবতে ছি জানু 😚',
  'ki koros': 'বস 𝗦𝗲𝗹𝗶𝗺 এর সাথে প্রেমে ব্যস্ত আছি 😏💘',
  'kire bot': 'হ্যাঁ, বস কেমন আছেন আপনার ওই খানে উম্মাহ 😘😽🙈',
  'valo aso': 'হ্যাঁ রে প্রিও, বস সাহু এর দোয়ায় ভালো আছি 😌💞',
  'pagol': 'হুম পাগল, কিন্তু তোমারই পাগল 😏😂',
  'breakup': 'চিন্তা করিস না… 𝗦𝗲𝗹𝗶𝗺 বস তো আছেই তোকে নতুন জন দিয়া দিবে 😎🔥',
  'tui ke': 'আমি তোর বস 𝗦𝗲𝗹𝗶𝗺 এর ChatBot 😏',
  'umm': 'এতো Umm কেনো জানু… কিছু বলবা? 😉',
  'hmm': 'Hmmm কিসের হুমম জানু 🥵',
  'lovely': 'Love করলে সরাসরি 𝗦𝗲𝗹𝗶𝗺 বস কে বল জানু 😻🔥',

  // Extra replies
  'hello': 'Hey there! 😊',
  'bot': 'Ji bolen! 🤖',
  'assalamu alaikum': 'Walaikumassalam❤️‍🩹',
  'salam': 'Walaikumassalam❤️‍🩹',
};

// Makes "Hi!", "HI", "hi 😊" and "𝗵𝗶" all look like "hi".
function normalize(text) {
  return String(text || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/^[\p{P}\p{S}\s]+|[\p{P}\p{S}\s]+$/gu, '')
    .trim();
}

const lookup = new Map();
for (const [key, value] of Object.entries(REPLIES)) {
  const normalizedKey = normalize(key);
  if (normalizedKey) {
    lookup.set(normalizedKey, value);
  }
}

function findReply(text) {
  if (!text || String(text).length > 100) return null;

  const value = lookup.get(normalize(text));
  if (value === undefined) return null;

  return Array.isArray(value) ? randomItem(value) : value;
}

// Called by events/message.js for messages that are not commands.
// Returns true if the message matched an auto-reply.
async function handle(ctx) {
  if (!config.autoReply.enabled) return false;

  const reply = findReply(ctx.text);
  if (!reply) return false;

  const threadId = (ctx.thread && ctx.thread.id) || 'unknown';
  const senderId = (ctx.sender && ctx.sender.id) || 'unknown';
  const key = `autoreply:${threadId}:${senderId}`;

  const wait = cooldown.consume(key, config.autoReply.cooldownSeconds);
  if (wait > 0) return true;

  await ctx.reply(reply);
  return true;
}

module.exports = {
  name: 'autoReply',
  version: '1.0.0',
  credits: 'Selim Sizu',
  handle,
  findReply,
};
