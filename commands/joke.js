'use strict';

const { box, randomItem } = require('../utils/format');

const JOKES = [
  'Teacher: Tumi school e keno late?\nStudent: Sir, rasta e sign dekhlam: "School Ahead, Go Slow" 😅',
  'Why did the phone go to school?\nBecause it wanted to be smarter! 📱',
  'Ami: Ajke theke diet shuru korbo.\nPet: Ajker moto na, kal theke! 🍔',
  'Why don\'t programmers like nature?\nToo many bugs! 🐛',
  'Mother: Beta, math e koto peyechho?\nSon: Ma, ami record korechi!\nMother: Ki record?\nSon: Shobar niche! 😎',
  'Friend: Tui ki ghumos?\nAmi: Na, ami phone dekhte dekhte bondho hoye jai! 😴',
  'Why was the computer cold?\nBecause it left its Windows open! 🪟',
  'Wife: Tumi ki amake ekhono bhalobaso?\nHusband: WiFi password er moto, jotoi bhuli, mone rakhi! 😂',
  'Doctor: Apni ki kichu bhule jan?\nPatient: Ha doctor.\nDoctor: Kotodin dhore?\nPatient: Ki kotodin dhore? 🤔',
  'Teacher: Pani er rong ki?\nStudent: Sir, pani te to rong-i nai, sorbot hole alada kotha! 🥤',
  'Me: Ajke early ghumabo.\nAlso me at 3 AM: Ek ta last video dekhi 📱😆',
  'Student: Sir, ami kichui korini, tahole kano zero?\nTeacher: Ei jonnoi to zero! 😜',
];

let lastIndex = -1;

function pickJoke() {
  if (JOKES.length === 1) return JOKES[0];

  let index = Math.floor(Math.random() * JOKES.length);
  if (index === lastIndex) {
    index = (index + 1) % JOKES.length;
  }
  lastIndex = index;
  return JOKES[index];
}

module.exports = {
  name: 'joke',
  aliases: [],
  description: 'Send a random funny joke',
  usage: 'joke',
  permission: 'everyone',
  category: 'Fun',

  async execute(ctx) {
    const joke = pickJoke() || randomItem(JOKES);
    await ctx.reply(box('JOKE 😂', [joke]));
  },
};
