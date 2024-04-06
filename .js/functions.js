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
  var textBox = document.getElementById("myText");

  textBox.style.width = `${squareSideLength}px`;
  textBox.style.height = `${squareSideLength}px`;
  textBox.style.fontSize = `${squareSideLength / 18}px`;
}

// Execute on page finish loading
document.addEventListener("DOMContentLoaded", function () {
  dynamicTextSizer();
  randomImage();
});

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

preparePage();
