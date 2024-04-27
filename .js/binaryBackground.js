// Local utils
const diagonalLength = () => {
  const { innerHeight, innerWidth } = window;
  return Math.sqrt(innerHeight * innerHeight + innerWidth * innerWidth);
};

// Init binary rows
const divNumForText = 10,
  rowNum = 3;
const genBinary = () => {
  let output = "";
  for (let i = 0; i < 20; i++) output += `${getRandomInt(2)}`;
  return output;
};
const initBinaryRows = () => {
  for (let i = 0; i < rowNum; i++) {
    const outterDiv = document.createElement("div"),
      text1Div = document.createElement("div"),
      text2Div = document.createElement("div"),
      text1 = document.createElement("span"),
      text2 = document.createElement("span"),
      runTime = 3 + getRandomInt(12);
    outterDiv.classList.add("relative", "whitespace-nowrap", "flex", "flex-row");
    outterDiv.append(text1Div, text2Div);
    text1Div.append(text1), text2Div.append(text2);
    text1Div.classList.add(`animate-[marquee1_${runTime}s_linear_infinite]`, `leading-[${diagonalLength() * 0.125}px]`);
    text2Div.classList.add(
      `animate-[marquee2_${runTime}s_linear_infinite]`,
      "translate-x-full",
      "absolute",
      "top-0",
      `leading-[${diagonalLength() * 0.125}px]`
    );
    text2.classList.add("-translate-x-1/2");
    (text1.id = `text${i}_1`), (text2.id = `text${i}_2`);
    (text1.innerText = genBinary()), (text2.innerText = genBinary());

    ele("binaryDiv").appendChild(outterDiv);
  }
};

// Resize text
const textResize = () => {
  for (let i = 0; i < rowNum; i++) {
    ele(`text${i}_1`).style.fontSize = diagonalLength() / divNumForText + "px";
    ele(`text${i}_2`).style.fontSize = diagonalLength() / divNumForText + "px";
  }
};

// Website's window resize trigger
window.addEventListener("resize", async () => {
  textResize();
});

// Website's content finished load trigger
window.addEventListener("DOMContentLoaded", async () => {
  initBinaryRows();
  textResize();
});
