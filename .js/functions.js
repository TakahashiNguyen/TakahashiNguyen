const isMobile = navigator.userAgentData.mobile;
const targetDate = new Date("2025-10-04T00:00:00").getTime();
const getRandomInt = (max) => Math.floor(Math.random() * max);
const images = [
  "Akiyoshidai",
  "CaoBằng",
  "CátBà",
  "Dorset",
  "Dorset_1",
  "Halnaker",
  "HồYamanaka",
  "ISS",
  "LâuĐàiHimeji",
  "SôngCửuLong",
  "California",
].map((imageName) => {
  var reader = new FileReader();
  fetch(`https://raw.githubusercontent.com/TakahashiNguyen/TakahashiNguyen/main/.jpg/${imageName}.jpg`)
    .then((response) => response.blob())
    .then((blob) => reader.readAsDataURL(blob));
  return reader;
});
const imageDuration = 15000;
const randomImage = async () => {
  const width = window.innerWidth;
  if (width >= 1024 && myImg.src != "") return;

  var currentIndex = images.map((i) => i.result).indexOf(myImg.src);
  do {
    var newIndex = getRandomInt(images.length);
  } while (newIndex == currentIndex);
  var data = images[newIndex].result;
  var bool = data !== null;

  if (bool) {
    fadeOut(myImg, 1000);
    await fadeOut(myName, 1200);

    myImg.src = data;

    fadeIn(myImg, 1000);
    await fadeIn(myName, 1200);
  } else {
    await delay(100);
    randomImage();
  }
};

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fadeIn(element, duration) {
  const interval = setInterval(() => {
    var l = parseFloat(element.style.opacity);
    if (l < 1) {
      l += 0.02;
      element.style.opacity = l;
    } else {
      clearInterval(interval);
    }
  }, duration / 50); // Interval in milliseconds (adjust as needed)
  await delay(duration + 20);
}

async function fadeOut(element, duration) {
  const interval = setInterval(() => {
    var l = parseFloat(element.style.opacity);
    if (l > 0) {
      l -= 0.02;
      element.style.opacity = l;
    } else {
      clearInterval(interval);
    }
  }, duration / 50); // Interval in milliseconds (adjust as needed)
  await delay(duration + 20);
}

function dynamicTextSizer(name, nickname, hashtag) {
  const { innerHeight, innerWidth } = window;
  const squareSideLength = Math.min(innerHeight, innerWidth);

  name.style.height = name.style.width = `${squareSideLength}px`;
  name.style.lineHeight = name.style.fontSize = `${squareSideLength / 18}px`;

  nickname.style.lineHeight = nickname.style.fontSize = `${squareSideLength / 20}px`;
  hashtag.style.lineHeight = hashtag.style.fontSize = `${squareSideLength / 64}px`;

  if (!isMobile) {
    hashtag.style.marginTop = `${squareSideLength / 100}px`;
    nickname.style.marginBottom = `-${squareSideLength / 74}px`;
  }
}

function changeTextColor() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const canvaSize = Math.min(myImg.width, myImg.height) / 9;
  canvas.width = canvaSize * 5;
  canvas.height = canvaSize * 2;
  var x = (myImg.width - canvas.width) / 2;
  var y = (myImg.height - canvas.height) / 2;

  context.drawImage(myImg, -x, -y, myImg.width, myImg.height);
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
  const averageR = Math.abs((brightness < 128 ? 270 : 180) - Math.floor(r / pixelCount));
  const averageG = Math.abs((brightness < 128 ? 270 : 180) - Math.floor(g / pixelCount));
  const averageB = Math.abs((brightness < 128 ? 270 : 180) - Math.floor(b / pixelCount));

  const averageColor = `rgb(${averageR}, ${averageG}, ${averageB})`;
  myName.style.color = averageColor;
}

function scriptDOMContentLoaded() {
  dynamicTextSizer(myName, nickName, myHashTag);
  dynamicTextSizer(myNameSub, nickNameSub, myHashTagSub);
  randomImage();
}

const countdown = setInterval(() => {
  const now = new Date().getTime();

  // Calculate the remaining time
  const remainingTime = targetDate - now;

  // Calculate the days, hours, minutes, and seconds
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  // Update the HTML elements with the calculated time units
  advisoryDays.textContent = days.toString().padStart(2, "0");
  advisoryHours.textContent = hours.toString().padStart(2, "0");
  advisoryMinutes.textContent = minutes.toString().padStart(2, "0");
  advisorySeconds.textContent = seconds.toString().padStart(2, "0");

  // Check if the countdown has reached zero
  if (remainingTime < 0) {
    clearInterval(countdown);
  }
}, 1000);

setInterval(() => {
  randomImage();
}, imageDuration);

window.addEventListener("DOMContentLoaded", function () {
  scriptDOMContentLoaded();
});

window.addEventListener("load", () => {
  fadeOut(loadingPage, 1500);
});

window.addEventListener("resize", function () {
  dynamicTextSizer(myName, nickName, myHashTag);
  dynamicTextSizer(myNameSub, nickNameSub, myHashTagSub);
});
