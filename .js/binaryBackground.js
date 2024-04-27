// Local utils
const genBinary = (previous = "") => {
    let output = previous;
    if (previous == "") {
      for (let i = 0; i < 10; i++) output += `${getRandomInt(2)}`;
    } else {
      let numChange = previous.length / 6;
      do {
        numChange -= 1;
        let pos = getRandomInt(previous.length);
        output = replaceAt(output, pos, `${(parseInt(previous[pos]) + 1) % 2}`);
      } while (numChange > 0);
    }
    return output;
  },
  diagonalLength = () => {
    const { innerHeight, innerWidth } = window;
    return Math.sqrt(innerHeight * innerHeight + innerWidth * innerWidth);
  },
  getFontSize = () => 130,
  getFontWidth = () => getFontSize() / 2,
  getFontHeight = () => (getFontSize() * 3) / 4,
  rowNum = () => floor(diagonalLength() / getFontHeight());
let addRowNum = 0,
  stringLength = 0,
  randomDigitDelay = 0;

// Init binary rows
function initBinaryRows(from = 0) {
  addRowNum = rowNum();
  for (let i = from; i < addRowNum; i++) {
    const outterDiv = document.createElement("div"),
      text1Div = document.createElement("div"),
      text2Div = document.createElement("div"),
      text1 = document.createElement("span"),
      text2 = document.createElement("span"),
      runTime = 10 + getRandomInt(36);
    outterDiv.classList.add("relative", "whitespace-nowrap", "flex", "flex-row");
    outterDiv.append(text1Div, text2Div);
    text1Div.append(text1), text2Div.append(text2);
    text1Div.classList.add(`animate-[marquee1_${runTime}s_linear_infinite]`);
    text2Div.classList.add(`animate-[marquee2_${runTime}s_linear_infinite]`, "translate-x-full", "absolute", "top-0");
    text1.classList.add("inline-block", `leading-[${getFontHeight()}px]`);
    text2.classList.add("inline-block", `leading-[${getFontHeight()}px]`);
    (text1.innerText = genBinary()), (text2.innerText = genBinary());
    (text1.id = `text${i}_1`), (text2.id = `text${i}_2`);

    ele("binaryDiv").appendChild(outterDiv);
  }
}

// Resize text
function textResize() {
  for (let i = 0; i < addRowNum; i++) {
    ele(`text${i}_1`).style.fontSize = getFontSize() + "px";
    ele(`text${i}_2`).style.fontSize = getFontSize() + "px";
  }
}

// Update strings
async function updateStrings() {
  randomDigitDelay = 1;
  for (let i = 0; i < addRowNum; i++) {
    ele(`text${i}_1`).innerText = genBinary(ele(`text${i}_1`).innerText);
    ele(`text${i}_2`).innerText = genBinary(ele(`text${i}_1`).innerText);
  }
  do {
    randomDigitDelay -= 1;
    await delay(1000);
  } while (randomDigitDelay > 0);
  setTimeout(updateStrings);
}

// Update rows
function checkViewSize() {
  if (addRowNum < rowNum()) {
    updateCombo(addRowNum);
  }
}

// Website's window resize trigger
window.addEventListener("resize", async () => {
  checkViewSize();
});

// Update combo
function updateCombo(from = 0) {
  initBinaryRows(from);
  textResize();
}

// Website's content finished load trigger
window.addEventListener("DOMContentLoaded", async () => {
  updateCombo();
  updateStrings();
});
