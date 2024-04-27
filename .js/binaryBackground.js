// Local utils
const genBinary = (previous = "") => {
    let output = previous;
    if (previous == "") {
      for (let i = 0; i < stringLength; i++) output += `${getRandomInt(2)}`;
    } else {
      let numChange = previous.length * (9 / 100);
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
  getFontSize = () => 37,
  getFontWidth = () => getFontSize() / 2,
  getFontHeight = () => (getFontSize() * 5) / 10,
  rowNum = () => floor(diagonalLength() / getFontHeight());
let addRowNum = 0,
  stringLength = 250,
  randomDigitDelay = 0;

// Generate SVG block
function genSVGBlock(id, spped) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", `leading-[${getFontHeight()}px] block`);
  svg.setAttribute("id", `svg${id}`);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  svg.appendChild(defs);

  var mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
  mask.setAttribute("id", `mask${id}`);
  defs.appendChild(mask);

  var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  mask.appendChild(rect);
  rect.setAttribute("class", "fill-white");
  rect.setAttribute("id", `rect${id}`);

  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", "50%");
  text.setAttribute("y", "60%");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("id", `text${id}`);
  text.textContent = genBinary();
  mask.appendChild(text);

  var rectBlock1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rectBlock1.setAttribute("class", `dark:fill-white fill-[#370037] animate-[marquee1_${spped}s_linear_infinite] `);
  rectBlock1.setAttribute("style", `mask: url(#mask${id})`);
  rectBlock1.setAttribute("id", `rectBlock${id}_1`);
  svg.appendChild(rectBlock1);

  var rectBlock2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rectBlock2.setAttribute(
    "class",
    `dark:fill-white fill-[#370037]  animate-[marquee2_${spped}s_linear_infinite] absolute`
  );
  rectBlock2.setAttribute("style", `mask: url(#mask${id})`);
  rectBlock2.setAttribute("id", `rectBlock${id}_2`);
  svg.appendChild(rectBlock2);

  return svg;
}

// Init binary rows
function initBinaryRows(from = 0) {
  addRowNum = rowNum();
  const initSpeed = stringLength / 10 + 250;
  let prevSpeed = initSpeed;
  for (let i = from; i < addRowNum; i++) {
    const curSpeed = prevSpeed + (getRandomInt(initSpeed / 15) + 1) * (getRandomInt(2) ? -1 : 1),
      text = genSVGBlock(i, curSpeed);

    ele("binaryDiv").appendChild(text);
    prevSpeed = curSpeed;
  }
}

// Resize text
function textResize() {
  for (let i = 0; i < addRowNum; i++) {
    ele(`text${i}`).style.fontSize = getFontSize() + "px";
    ele(`rect${i}`).style.width =
      ele(`rectBlock${i}_1`).style.width =
      ele(`rectBlock${i}_2`).style.width =
      ele(`svg${i}`).style.width =
        ele(`text${i}`).getComputedTextLength();
    ele(`rect${i}`).style.height =
      ele(`rectBlock${i}_1`).style.height =
      ele(`rectBlock${i}_2`).style.height =
      ele(`svg${i}`).style.height =
        getFontSize() * (3 / 4) + "px";
  }
}

// Update strings
async function updateStrings() {
  randomDigitDelay = 1;
  for (let i = 0; i < addRowNum; i++) {
    ele(`text${i}`).textContent = genBinary(ele(`text${i}`).textContent);
  }
  do {
    randomDigitDelay -= 1;
    await delay(200);
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
