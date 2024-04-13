var player;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomImage() {
  const imageUrls = [
    "Akiyoshidai",
    "CaoBằng",
    "CátBà",
    "Dorset",
    "Halnaker",
    "HồYamanaka",
    "ISS",
    "LâuĐàiHimeji",
    "SôngCửuLong",
    "VũngNapa",
  ];
  myImg.src = `https://raw.githubusercontent.com/TakahashiNguyen/TakahashiNguyen/main/.jpg/${
    imageUrls[getRandomInt(imageUrls.length)]
  }.jpg`;
}

function dynamicTextSizer() {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const squareSideLength = Math.min(windowHeight, windowWidth);

  myName.style.height = myName.style.width = `${squareSideLength}px`;
  myName.style.lineHeight = myName.style.fontSize = `${
    squareSideLength / 18
  }px`;

  nickName.style.lineHeight = nickName.style.fontSize = `${
    squareSideLength / 20
  }px`;
  myHashTag.style.lineHeight = myHashTag.style.fontSize = `${
    squareSideLength / 64
  }px`;

  if (!isMobile) {
    myHashTag.style.marginTop = `${squareSideLength / 100}px`;
    nickName.style.marginBottom = `-${squareSideLength / 74}px`;
  }
}

// Execute on page finish loading
function scriptDOMContentLoaded() {
  dynamicTextSizer();
  randomImage();
  myImg.crossOrigin = "anonymous";
  myImg.onload = function () {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const canvaSize = 400;
    canvas.width = canvas.height = canvaSize;
    var squareSize = Math.min(myImg.width, myImg.height);
    var x = (canvas.width - squareSize) / 2;
    var y = (canvas.height - squareSize) / 2;

    // Draw the center square onto the canvas
    context.drawImage(
      myImg,
      x,
      y,
      squareSize,
      squareSize,
      0,
      0,
      canvaSize,
      canvaSize
    );

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let r = 0,
      g = 0,
      b = 0;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    const pixelCount = data.length / 4;
    const averageR = 255 - Math.floor(r / pixelCount);
    const averageG = 255 - Math.floor(g / pixelCount);
    const averageB = 255 - Math.floor(b / pixelCount);

    const averageColor = `rgb(${averageR}, ${averageG}, ${averageB})`;
    textDiv.style.color = averageColor;
  };

  myImg.style.objectFit = isMobile ? "cover" : "contain";
  if (isMobile) removeVideo();
}
document.addEventListener("DOMContentLoaded", scriptDOMContentLoaded);

// Execute on page change size
window.addEventListener("resize", function () {
  dynamicTextSizer();
});

// Set the target date and time
const targetDate = new Date("2025-10-04T00:00:00").getTime();

// Update the countdown every second
const countdown = setInterval(() => {
  // Get the current date and time
  const now = new Date().getTime();

  // Calculate the remaining time
  const remainingTime = targetDate - now;

  // Calculate the days, hours, minutes, and seconds
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
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
    // Perform any desired action when the countdown reaches zero
  }
}, 1000);

const isMobile = navigator.userAgentData.mobile;
