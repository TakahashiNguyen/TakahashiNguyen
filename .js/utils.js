const isWindows = /Windows/i.test(navigator.userAgent),
  isLinux = /Linux/i.test(navigator.userAgent),
  isMobile = /Mobile/i.test(navigator.userAgent),
  ele = (s) => document.getElementById(s),
  getIdsHasSubString = (s) => document.querySelectorAll(`[id*=${s}]`),
  abs = (v) => Math.abs(v),
  floor = (v) => Math.floor(v),
  getRandomInt = (max) => Math.floor(Math.random() * max),
  delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  RGBToHex = (r, g, b) =>
    "#" +
    ((1 << 24) | (abs(r + luckyColor[0]) << 16) | (abs(g + luckyColor[1]) << 8) | abs(b + luckyColor[2]))
      .toString(16)
      .slice(1),
  HexToRgb = (hex, rr = 0, gg = 0, bb = 0) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "#000000");
    return [
      parseInt(result[1], 16) + rr + luckyColor[0],
      parseInt(result[2], 16) + gg + luckyColor[1],
      parseInt(result[3], 16) + bb + luckyColor[2],
    ];
  };
