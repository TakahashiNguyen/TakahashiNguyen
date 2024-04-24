const isWindows = /Windows/i.test(navigator.userAgent);
const isLinux = /Linux/i.test(navigator.userAgent);
const isMobile = /Mobile/i.test(navigator.userAgent);
const ele = (s) => document.getElementById(s);
const getIdsHasSubString = (s) => document.querySelectorAll(`[id*=${s}]`);
const abs = (v) => Math.abs(v);
const floor = (v) => Math.floor(v);
const getRandomInt = (max) => Math.floor(Math.random() * max);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const updateClass = (obj, prefix, main, suffix = "") => {
  try {
    const classes = obj.classList;
    classes.remove(classes[classes.length - 1]);
    classes.add(`${prefix}-[${main}]${suffix}`);
  } catch (error) {}
};
const RGBToHex = (r, g, b) =>
  "#" +
  ((1 << 24) | (abs(r + luckyColor[0]) << 16) | (abs(g + luckyColor[1]) << 8) | abs(b + luckyColor[2]))
    .toString(16)
    .slice(1);
const HexToRgb = (hex, rr = 0, gg = 0, bb = 0) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "#000000");
  return [
    parseInt(result[1], 16) + rr + luckyColor[0],
    parseInt(result[2], 16) + gg + luckyColor[1],
    parseInt(result[3], 16) + bb + luckyColor[2],
  ];
};
const imgUrltoData = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(async (blob) => {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      while (reader.readyState != 2) await delay(100);
      return reader.result;
    })
    .catch((error) => {
      console.error(error);
      return "";
    });
const randomImage = async (dur, loop = false) => {
  var currentIndex = images.indexOf(ele("myImg").src);
  randomImageDelayLeft = 100;
  do {
    var newIndex = getRandomInt(images.length);
  } while (newIndex == currentIndex);
  var data = images[newIndex];
  var bool = data != null;

  if (bool) {
    await Promise.all([
      fade(ele("myImg"), (dur * 7) / 100, 1, 0),
      fade(ele("textDivSub"), (dur * 3) / 100, 0, 1),

      fade(ele("textDiv"), (dur * 5) / 100, 1, 0),
      fade(ele("githubSpin"), (dur * 2) / 100, 1, 0),
    ]);

    ele("myImg").setAttribute("src", data);
    try {
      mySpotify.src += "";
    } catch (error) {}

    await Promise.all([
      fade(ele("myImg"), (dur * 7) / 100, 0, 1),
      fade(ele("textDivSub"), (dur * 3) / 100, 1, 0),

      fade(ele("textDiv"), (dur * 5) / 100, 0, 1),
      fade(ele("githubSpin"), (dur * 2) / 100, 0, 1),
    ]);
  }
  if (bool) {
    do {
      randomImageDelayLeft -= 1;
      await delay((dur / 100) * 0.74);
    } while (randomImageDelayLeft > 0);
  } else await delay(100);
  if (loop) randomImage(dur, true);
};
const updateTextDecoration = () => {
  updateClass(ele("githubSpin"), "outline", textNameColor);

  const updateColor = (imageBackgroundBrightness > 128 ? 1 : -1) * 74;
  const color = RGBToHex(...HexToRgb(textNameColor, updateColor, updateColor, updateColor));
  const siz = (e) => (textSquareSize / (1941 * 2)) * e;
  ele("textDiv").style.textShadow = `
    ${-siz(1)}px ${siz(1)}px ${siz(1)}px ${color},
    ${-siz(3)}px ${siz(3)}px ${siz(3)}px ${color},
    ${-siz(6)}px ${siz(6)}px ${siz(6)}px ${color},
    ${-siz(10)}px ${siz(10)}px ${siz(10)}px ${color},
    ${-siz(15)}px ${siz(15)}px ${siz(15)}px ${color}
  `;
  ele("textDiv").style.color = textNameColor;
};

const dynamicDuration = 140000;
const luckyColor = [getRandomInt(13) - 6, getRandomInt(13) - 6, getRandomInt(13) - 6];
let imageBackgroundBrightness = 0,
  textNameColor = "",
  randomImageDelayLeft = 0;
var images = [];
Promise.all(
  [
    "Akiyoshidai",
    "CaoBằng",
    "CátBà",
    "Centre-ValDeLoire",
    "Dorset",
    "Dorset_1",
    "Halnaker",
    "HCMUS",
    "HoàngCungTokyo",
    "HồYamanaka",
    "ISS",
    "Killarnery",
    "LâuĐàiHimeji",
    "SôngCửuLong",
    "UnionSquare",
    "VũngNapa",
    "Yellowstone",
  ].map(async (imageName) => {
    return await imgUrltoData(
      `https://raw.githubusercontent.com/TakahashiNguyen/TakahashiNguyen/main/.jpg/${imageName}.jpg`
    );
  })
).then((values) => {
  images = values;
});

async function fade(element, duration, from, to, fps = 60, callafter = () => {}) {
  return new Promise(async (resolve) => {
    var l = from,
      i = (from > to ? -1 : 1) * (1 / (duration * (fps / 1000)));
    while (from < to ? l < to : l > to) {
      try {
        element.style.opacity = l;
      } catch (error) {
        resolve();
        return;
      }
      l += i;
      await delay((1 / fps) * 1000);
    }
    element.style.opacity = to;
    callafter();
    resolve();
  });
}

async function dynamicTextSizer(name, nickname, hashtag) {
  const { innerHeight, innerWidth } = window;
  try {
    textSquareSize = Math.min(innerHeight, innerWidth);
    if (isBanner) textSquareSize = 600;
  } catch (error) {}

  try {
    name.style.height = name.style.width = `${textSquareSize}px`;
    name.style.lineHeight = name.style.fontSize = `${textSquareSize / 18}px`;

    nickname.style.lineHeight = nickname.style.fontSize = `${textSquareSize / 20}px`;
    hashtag.style.lineHeight = hashtag.style.fontSize = `${textSquareSize / 64}px`;

    if (isWindows) {
      nickname.style.marginBottom = `-${textSquareSize / 74}px`;
      hashtag.style.marginTop = `${textSquareSize / 150}px`;
    }
  } catch (error) {}
}

function changeTextColor() {
  const canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
  const context = canvas.getContext("2d");
  const canvaSize = Math.min(ele("myImg").width, ele("myImg").height) / 14;
  canvas.width = canvaSize * 11;
  canvas.height = canvaSize * 4;
  var x = (ele("myImg").width - canvas.width) / 2;
  var y = (ele("myImg").height - canvas.height) / 2;

  context.drawImage(ele("myImg"), -x, -y, ele("myImg").width, ele("myImg").height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let r = 0,
    g = 0,
    b = 0,
    avg = 0,
    colorSum = 0;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    avg = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
    colorSum += avg;
  }

  const brightness = Math.floor(colorSum / (canvas.height * canvas.width));
  const pixelCount = data.length / 4;
  const averageR = abs((brightness < 128 ? 270 : 180) - Math.floor(r / pixelCount));
  const averageG = abs((brightness < 128 ? 270 : 180) - Math.floor(g / pixelCount));
  const averageB = abs((brightness < 128 ? 270 : 180) - Math.floor(b / pixelCount));
  imageBackgroundBrightness = brightness;
  textNameColor = RGBToHex(averageR, averageG, averageB);
  updateTextDecoration();
}

var dynamicInvertal;
const dynamicFunctions = async () => {};
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(dynamicInvertal);
  } else {
    dynamicInvertal = setInterval(dynamicFunctions, dynamicDuration);
  }
});

const myName = "Nguyễn Việt Anh";
const myNickName = "Takahashi";
const hashTag = "makeUKgreatagain";
window.addEventListener("DOMContentLoaded", async () => {
  getIdsHasSubString("name").forEach((obj) => (obj.textContent = myName));
  getIdsHasSubString("nickName").forEach((obj) => (obj.textContent = myNickName));
  getIdsHasSubString("myHashTag").forEach((obj) => (obj.textContent = "#" + hashTag));

  dynamicInvertal = setInterval(dynamicFunctions, dynamicDuration);
  randomImage(randomImageDuration, true);
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ele("textDiv").style.color = "black";
});
