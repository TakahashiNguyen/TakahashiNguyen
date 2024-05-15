import { floor, getElementById, getRandomInt, replaceAt, delay } from "./utils.js";
import "jquery";

// Local utils
const generateBinary = (previous = "") => {
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
function generateSVGBlock(id, speed) {
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("id", `svg-${id}`);
	svg.setAttribute("y", `${id * getFontHeight()}px`);
	svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

	const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
	svg.appendChild(defs);

	const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
	mask.setAttribute("id", `mask-${id}`);
	defs.appendChild(mask);

	const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	mask.appendChild(rect);
	rect.setAttribute("class", "fill-black rectBlock");

	const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	text.setAttribute("x", "50%");
	text.setAttribute("y", getFontWidth());
	text.setAttribute("dominant-baseline", "middle");
	text.setAttribute("text-anchor", "middle");
	text.setAttribute("class", "fill-white rectBlock textBlock");
	text.id = `text-${id}`;
	text.textContent = generateBinary();
	mask.appendChild(text);

	const rectBlock3 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectBlock3.setAttribute("class", "fill-white rectBlock");
	svg.appendChild(rectBlock3);

	const rectBlock1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectBlock1.setAttribute(
		"class",
		`fill-black animate-[marquee1_${speed}s_linear_infinite] rectBlock`
	);
	rectBlock1.style.mask = `url(#mask-${id})`;
	svg.appendChild(rectBlock1);

	const rectBlock2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectBlock2.setAttribute(
		"class",
		`fill-black animate-[marquee2_${speed}s_linear_infinite] rectBlock`
	);
	rectBlock2.style.mask = `url(#mask-${id})`;
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
			text = generateSVGBlock(i, curSpeed);

		getElementById("binaryDefs").appendChild(text);
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
	$(".textBlock").css("font-size", getFontSize() + "px");
	$(".rectBlock").css("height", getFontSize() + "px");
	$(".rectBlock").css("width", getElementById(`text-${0}`).getComputedTextLength() + "px");
}

// Update strings
async function updateStrings() {
	randomDigitDelay = 1;
	for (let i = 0; i < addRowNum; i++) {
		getElementById(`text-${i}`).textContent = generateBinary(
			getElementById(`text-${i}`).textContent
		);
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
	getElementById("binaryRect").style.width = getElementById(
		`text-${addRowNum - 1}`
	).getComputedTextLength();
	getElementById("binaryRect").style.height = addRowNum * getFontHeight();
	resizeSVG();
}

// Website's content finished load trigger
window.addEventListener("load", async () => {
	updateStrings();
	await delay(500);
	updateCombo();
});
