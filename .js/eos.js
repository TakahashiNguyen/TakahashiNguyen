var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
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
