var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";

var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function onYouTubeIframeAPIReady() {
  /*if (getRandomInt(2) === 0)
    player = new YT.Player("myVideo", {
      height: "100%",
      width: "100%",
      videoId: "dQw4w9WgXcQ",
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
  else
    player = new YT.Player("myVideo", {
      height: "100%",
      width: "100%",
      videoId: "kIEWJ1ljEro",
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
    });*/
  player = new YT.Player("myVideo", {
    height: "100%",
    width: "100%",
    videoId: "FIqtCVE-U7w",
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

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  //event.target.playVideo();
  player.playVideo();
}

// 5. The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
  console.log(event);
  if (event.data == YT.PlayerState.PLAYING) {
    console.log("sus");
  }
  if (event.data === -1) {
    document.getElementById("myVideo").remove();
    myText.style.filter = "none";
    subText.style.color = "white";
  }
}
function stopVideo() {
  player.stopVideo();
}
