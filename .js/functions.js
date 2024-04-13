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
    "Dorset_1",
    "Halnaker",
    "HoàngCungTokyo",
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

function preparePage() {
  // Add YouTube API video call
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

function dynamicTextSizer() {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const squareSideLength = Math.min(windowHeight, windowWidth);
  var textBox = document.getElementById("myName");
  var nickName = document.getElementById("nickName");
  var hashTag = document.getElementById("myHashTag");

  textBox.style.height = textBox.style.width = `${squareSideLength}px`;
  textBox.style.lineHeight = textBox.style.fontSize = `${
    squareSideLength / 18
  }px`;

  nickName.style.lineHeight = nickName.style.fontSize = `${
    squareSideLength / 20
  }px`;
  hashTag.style.lineHeight = hashTag.style.fontSize = `${
    squareSideLength / 64
  }px`;

  if (!isMobile) {
    hashTag.style.marginTop = `${squareSideLength / 100}px`;
    nickName.style.marginBottom = `-${squareSideLength / 74}px`;
  }
}

// Execute on page finish loading
function scriptDOMContentLoaded() {
  dynamicTextSizer();
  randomImage();

  var img = document.getElementById("myImg");
  img.style.objectFit = isMobile ? "cover" : "contain";
}
document.addEventListener("DOMContentLoaded", scriptDOMContentLoaded);

// Execute on page change size
window.addEventListener("resize", function () {
  dynamicTextSizer();
});

function onYouTubeIframeAPIReady() {
  ran_value = getRandomInt(3);
  vid_id = "IlVShjKur0I";
  if (ran_value === 0) vid_id = "jNxUnXahFcg";
  else if (ran_value === 1) vid_id = "P7b6NOfJtPY";
  player = new YT.Player("myVideo", {
    height: "100%",
    width: "100%",
    videoId: vid_id,
    playerVars: {
      playsinline: 1,
      autoplay: 1,
      loop: 1,
      rel: 0,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  player.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    console.log("UK is in his natural habitat");
  } else {
    document.getElementById("myVideo").remove();
    document.getElementById("textDiv").classList.remove("myInvert");
    myText.style.color = "white";
  }
}

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
  document.getElementById("advisoryDays").textContent = days
    .toString()
    .padStart(2, "0");
  document.getElementById("advisoryHours").textContent = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("advisoryMinutes").textContent = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("advisorySeconds").textContent = seconds
    .toString()
    .padStart(2, "0");

  // Check if the countdown has reached zero
  if (remainingTime < 0) {
    clearInterval(countdown);
    // Perform any desired action when the countdown reaches zero
  }
}, 1000);

const isMobile = navigator.userAgentData.mobile;

preparePage();
