let textSquareSize = 0;
const randomImageDuration = 23000;

// The countdown
const targetDate = new Date("2024-01-28T00:00:00");
targetDate.setMonth(targetDate.getMonth() + 19);
const countdown = setInterval(() => {
  const now = new Date().getTime();

  // Calculate the remaining time
  const remainingTime = targetDate.getTime() - now;

  // Calculate the days, hours, minutes, and seconds
  const days = abs(Math.floor(remainingTime / (1000 * 60 * 60 * 24)));
  const hours = abs(Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = abs(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = abs(Math.floor((remainingTime % (1000 * 60)) / 1000));

  // Update the HTML elements with the calculated time units
  advisoryDays.textContent = days.toString().padStart(2, "0");
  advisoryHours.textContent = hours.toString().padStart(2, "0");
  advisoryMinutes.textContent = minutes.toString().padStart(2, "0");
  advisorySeconds.textContent = seconds.toString().padStart(2, "0");

  // Check if the countdown has reached zero
  if (remainingTime < 0) {
    advisoryMain.textContent = "Seeking love for ";
  }
}, 1000);

// Website's load trigger
const cat = () => {
  return imgUrltoData(`https://cataas.com/cat`);
};
window.addEventListener("load", async () => {
  githubButton.addEventListener("click", () => {
    window.open(getRandomInt(6) ? "https://github.com/TakahashiNguyen" : "https://www.youtube.com/@vtv24", "_blank");
  });

  fade(loadingPage, 1975, 1, 0, 144, () => {
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
              icon: await cat(),
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
      }, 60000);
    }
  });
});

// Website's content finished load trigger
window.addEventListener("DOMContentLoaded", async () => {
  dynamicTextSizer(ele("textDiv"), ele("nickName"), ele("myHashTag"));
  dynamicTextSizer(ele("textDivSub"), ele("nickNameSub"), ele("myHashTagSub"));
});

// Website's window resize trigger
window.addEventListener("resize", async () => {
  dynamicTextSizer(ele("textDiv"), ele("nickName"), ele("myHashTag"));
  dynamicTextSizer(ele("textDivSub"), ele("nickNameSub"), ele("myHashTagSub"));
  changeTextColor();
});
