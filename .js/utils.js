const isWindows = /Windows/i.test(navigator.userAgent);
const isLinux = /Linux/i.test(navigator.userAgent);
const isMobile = /Mobile/i.test(navigator.userAgent);
const ele = (s) => document.getElementById(s);
const getIdsHasSubString = (s) => document.querySelectorAll(`[id*=${s}]`);
const abs = (v) => Math.abs(v);
const floor = (v) => Math.floor(v);
const getRandomInt = (max) => Math.floor(Math.random() * max);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
