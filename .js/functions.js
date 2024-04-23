const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const dynamicDuration = 140000;
const randomImageDuration = 23000;
let imageBackgroundBrightness = 0,
  textNameColor = "",
  randomImageDelayLeft = 0;
const ele = (str) => document.getElementById(str);
const getIdsHasSubString = (str) => document.querySelectorAll(`[id*=${str}]`);
const abs = (value) => Math.abs(value);
const getRandomInt = (max) => Math.floor(Math.random() * max);
const updateClass = (obj, prefix, main, suffix = "") => {
  try {
    const classes = obj.classList;
    classes.remove(classes[classes.length - 1]);
    classes.add(`${prefix}-[${main}]${suffix}`);
  } catch (error) {}
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const luckyColor = [getRandomInt(13) - 6, getRandomInt(13) - 6, getRandomInt(13) - 6];
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
var images = [];
Promise.all(
  [
    "Akiyoshidai",
    "California",
    "CaoBằng",
    "CátBà",
    "Centre-ValDeLoire",
    "Dorset",
    "Dorset_1",
    "Halnaker",
    "HồYamanaka",
    "ISS",
    "Killarnery",
    "LâuĐàiHimeji",
    "SôngCửuLong",
    "UnionSquare",
    "VũngNapa",
    "Yellowstone",
    "HCMUS",
  ].map(async (imageName) => {
    return await imgUrltoData(
      `https://raw.githubusercontent.com/TakahashiNguyen/TakahashiNguyen/main/.jpg/${imageName}.jpg`
    );
  })
).then((values) => {
  images = values;
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
      fade(ele("myImg"), (dur * 3) / 50, 1, 0),
      fade(ele("textDivSub"), (dur * 2) / 32, 0, 1),

      fade(ele("textDiv"), (dur * 2) / 13, 1, 0),
      fade(ele("githubSpin"), (dur * 2) / 74, 1, 0),
    ]);

    ele("myImg").setAttribute("src", data);
    try {
      mySpotify.src += "";
    } catch (error) {}

    await Promise.all([
      fade(ele("myImg"), (dur * 2) / 13, 0, 1),
      fade(ele("textDivSub"), (dur * 2) / 50, 1, 0),

      fade(ele("textDiv"), (dur * 3) / 32, 0, 1),
      fade(ele("githubSpin"), (dur * 3) / 74, 0, 1),
    ]);
  }
  if (bool) {
    do {
      randomImageDelayLeft -= 1;
      await delay(dur / 100);
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
  textSquareSize = Math.min(innerHeight, innerWidth);

  try {
    name.style.height = name.style.width = `${textSquareSize}px`;
    name.style.lineHeight = name.style.fontSize = `${textSquareSize / 18}px`;

    nickname.style.lineHeight = nickname.style.fontSize = `${textSquareSize / 20}px`;
    hashtag.style.lineHeight = hashtag.style.fontSize = `${textSquareSize / 64}px`;

    if (!isMobile) {
      hashtag.style.marginTop = `${textSquareSize / 100}px`;
      nickname.style.marginBottom = `-${textSquareSize / 74}px`;
    }
  } catch (error) {}
}

function changeTextColor() {
  const canvas = document.createElement("canvas");
  const context = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas").getContext("2d");
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
const startDynamicFunction = () => {
  dynamicInvertal = setInterval(dynamicFunctions, dynamicDuration);
};
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(dynamicInvertal);
  } else {
    startDynamicFunction();
  }
});

const myName = "Nguyễn Việt Anh";
const myNickName = "Takahashi";
const hashTag = "makeUKgreatagain";
window.addEventListener("DOMContentLoaded", async () => {
  getIdsHasSubString("name").forEach((obj) => (obj.textContent = myName));
  getIdsHasSubString("nickName").forEach((obj) => (obj.textContent = myNickName));
  getIdsHasSubString("myHashTag").forEach((obj) => (obj.textContent = "#" + hashTag));

  startDynamicFunction();
  randomImage(randomImageDuration, true);
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ele("textDiv").style.color = "black";
});
