import { floor, ele, getRandomInt, replaceAt, delay } from "./utils.js";

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
		while (output.length * getFontWidth() < diagonalLength()) {
			output += `${getRandomInt(2)}`;
		}
		stringLength = output.length;
		return output;
	},
	diagonalLength = () => {
		const { innerHeight, innerWidth } = window;
		return Math.sqrt(innerHeight * innerHeight + innerWidth * innerWidth);
	},
	getFontSize = () => 37,
	getFontWidth = () => getFontSize() / 2,
	getFontHeight = () => getFontSize() * (3 / 4),
	rowNum = () => floor(diagonalLength() / getFontHeight());
let addRowNum = 0,
	stringLength = 10,
	randomDigitDelay = 0;

// Generate SVG block
function genSVGBlock(id, speed) {
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("id", `svg${id}`);
	svg.setAttribute("y", `${id * getFontHeight()}px`);
	svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

	var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
	svg.appendChild(defs);

	var mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
	mask.setAttribute("id", `mask${id}`);
	defs.appendChild(mask);

	var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	mask.appendChild(rect);
	rect.setAttribute("class", "fill-black");
	rect.setAttribute("id", `rect${id}`);

	var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", "50%");
	text.setAttribute("y", getFontWidth());
	text.setAttribute("dominant-baseline", "middle");
	text.setAttribute("text-anchor", "middle");
	text.setAttribute("class", "fill-white");
	text.setAttribute("id", `text${id}`);
	text.textContent = genBinary();
	mask.appendChild(text);

	var rectBlock3 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectBlock3.setAttribute("class", `fill-white`);
	rectBlock3.setAttribute("id", `rectBlock${id}_3`);
	svg.appendChild(rectBlock3);

	var rectBlock1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectBlock1.setAttribute("class", `fill-black animate-[marquee1_${speed}s_linear_infinite]`);
	rectBlock1.setAttribute("style", `mask: url(#mask${id})`);
	rectBlock1.setAttribute("id", `rectBlock${id}_1`);
	svg.appendChild(rectBlock1);

	var rectBlock2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectBlock2.setAttribute("class", `fill-black animate-[marquee2_${speed}s_linear_infinite]`);
	rectBlock2.setAttribute("style", `mask: url(#mask${id})`);
	rectBlock2.setAttribute("id", `rectBlock${id}_2`);
	svg.appendChild(rectBlock2);

	return svg;
}

// Init binary rows
const initSpeed = () => (stringLength * getFontWidth()) / 3;
let prevSpeed = initSpeed();
async function initBinaryRows(from = 0) {
	if (addRowNum >= rowNum()) return;
	addRowNum = rowNum();
	for (let i = from; i < addRowNum; i++) {
		const curSpeed = prevSpeed + (getRandomInt(initSpeed() / 100) + 1) * (getRandomInt(2) ? -1 : 1),
			text = genSVGBlock(i, curSpeed);

		ele("binaryDefs").appendChild(text);
		prevSpeed = curSpeed;
	}
}

// ResizeSVG
async function resizeSVG() {
	var svg = document.getElementById("binaryDiv");
	var bbox = svg.getBBox();
	svg.setAttribute("width", bbox.x + bbox.width + bbox.x);
	svg.setAttribute("height", bbox.y + bbox.height + bbox.y);
}

// Resize text
async function textResize() {
	for (let i = 0; i < addRowNum; i++) {
		let text = ele(`text${i}`),
			rect1 = ele(`rectBlock${i}_1`),
			rect2 = ele(`rectBlock${i}_2`),
			rect3 = ele(`rectBlock${i}_3`),
			rect = ele(`rect${i}`);
		text.style.fontSize = getFontSize() + "px";
		[rect1, rect2, rect3, rect].forEach(async (r) => {
			r.style.width = text.getComputedTextLength();
			r.style.height = getFontSize() + "px";
		});
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

// Website's window resize trigger
window.addEventListener("resize", async () => {
	updateCombo();
});

// Update combo
async function updateCombo() {
	initBinaryRows(addRowNum);

	textResize();
	ele("binaryRect").style.width = ele(`text${addRowNum - 1}`).getComputedTextLength();
	ele("binaryRect").style.height = addRowNum * getFontHeight();
	resizeSVG();
}

// Website's content finished load trigger
window.addEventListener("load", async () => {
	updateCombo();
	updateStrings();
});
