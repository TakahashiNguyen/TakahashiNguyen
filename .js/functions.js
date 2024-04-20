const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const targetDate = new Date("2025-10-04T00:00:00").getTime();
const getRandomInt = (max) => Math.floor(Math.random() * max);
const imgUrltoData = (url) => {
  var reader = new FileReader();
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => reader.readAsDataURL(blob));
  return reader;
};
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
  return imgUrltoData(`https://raw.githubusercontent.com/TakahashiNguyen/TakahashiNguyen/main/.jpg/${imageName}.jpg`);
});
const dynamicDuration = 23000;
const randomImage = async (dur) => {
  var currentIndex = images.map((i) => i.result).indexOf(myImg.src);
  do {
    var newIndex = getRandomInt(images.length);
  } while (newIndex == currentIndex);
  var data = images[newIndex].result;
  var bool = data !== null;

  if (bool) {
    await Promise.all([
      fade(myImg, (dur * 3) / 50, 1, 0),
      fade(myName, (dur * 2) / 13, 1, 0),
      fade(myNameSub, (dur * 2) / 31, 0, 1),
    ]);

    myImg.src = data;

    Promise.all([
      fade(myImg, (dur * 2) / 13, 0, 1),
      fade(myName, (dur * 3) / 31, 0, 1),
      fade(myNameSub, (dur * 2) / 50, 1, 0),
    ]);
  } else {
    await delay(100);
    randomImage();
  }
};

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fade(element, duration, from, to, fps = 60, callafter = () => {}) {
  return new Promise(async (resolve) => {
    var l = from,
      i = (from > to ? -1 : 1) * (1 / (duration * (fps / 1000)));
    while (from < to ? l < to : l > to) {
      element.style.opacity = l;
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

  const averageColor = `rgb(${averageB}, ${averageR}, ${averageG})`;
  myName.style.color = averageColor;
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

var randomImageInvertal;
const dynamicFunctions = async () => {
  randomImage(dynamicDuration);
  document.getElementById("mySpotify").src += "";
};
const startRandomImage = () => {
  randomImage();
  randomImageInvertal = setInterval(dynamicFunctions, dynamicDuration);
};
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearInterval(randomImageInvertal);
  } else {
    startRandomImage();
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  dynamicTextSizer(myName, nickName, myHashTag);
  dynamicTextSizer(myNameSub, nickNameSub, myHashTagSub);
  startRandomImage();
});

window.addEventListener("load", async () => {
  githubButton.addEventListener("click", () => {
    window.open("https://github.com/TakahashiNguyen", "_blank");
  });

  fade(loadingPage, 1500, 1, 0, 144, () => {
    loadingPage.classList.add("hidden");
  });

  Notification.requestPermission().then((status) => {
    if (status === "granted") {
      setTimeout(() => {
        fetch("https://api.quotable.io/random")
          .then((response) => response.json())
          .then(async (response) => {
            const title = "Hi, How are you?";
            const img = "./.png/Larry_Chief_Mouser.png";
            const text = `Wish you a good day (。・ω・。)`;

            var cat = imgUrltoData(`https://cataas.com/cat`);
            do await delay(100);
            while (cat.result == null);
            const imgData =
              "data:image/svg+xml;base64," +
              btoa(`
      <svg viewBox="0 0 2700 1500" class="invisible" xmlns="http://www.w3.org/2000/svg" id="quoteSVG">
        <style>
          .fixed {position: fixed;}.flex {display: flex;}.h-full {height: 100%;}.w-full {width: 100%;}.flex-col {flex-direction: column;}.items-center {align-items: center;}.justify-center {justify-content: center;}.bg-white {--tw-bg-opacity: 1;background-color: rgb(255 255 255 / var(--tw-bg-opacity));}.px-60 {padding-left: 15rem;padding-right: 15rem;}.text-6xl {font-size: 3.75rem;line-height: 1;}.text-9xl {font-size: 8rem;line-height: 1;}.bg-black {--tw-bg-opacity: 1;background-color: rgb(0 0 0 / var(--tw-bg-opacity));}.text-white {--tw-text-opacity: 1;color: rgb(255 255 255 / var(--tw-text-opacity));}
        </style>
        <foreignObject x="0" y="0" width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" class="${
            window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "bg-black text-white"
              : "bg-white"
          } fixed w-full h-full flex items-center justify-center">
            <div class="fixed flex flex-col items-center justify-center text-9xl">
              <blockquote class="px-60">
                <p id="quoteMain">${response.content}</p>
                <footer class="text-6xl">
                  <cite title="Source Title" id="quoteAuthor">${response.author}</cite>
                </footer>
              </blockquote>
            </div>
          </div>
        </foreignObject>
      </svg>`);

            const options = {
              body: text,
              icon: cat.result,
              image: imgData,
              vibrate: [200, 100, 200],
              badge: img,
            };

            const notification = new Notification(title, options);

            notification.onclick = function (event) {
              event.preventDefault();
              window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
            };

            navigator.serviceWorker.ready.then(function (serviceWorker) {
              serviceWorker.showNotification(title, options);
            });
          });
      }, 6000);
    }
  });
});

window.addEventListener("resize", async () => {
  dynamicTextSizer(myName, nickName, myHashTag);
  dynamicTextSizer(myNameSub, nickNameSub, myHashTagSub);
});
