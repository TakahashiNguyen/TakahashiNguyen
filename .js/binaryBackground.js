import { floor, getElementById, getRandomInt, replaceAt, sleep } from "./utils.js";
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
	stringLength = 10;

// Generate SVG block
function generateSVGBlock(id, speed) {
	const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svgEl.id = `svg-${id}`;
	svgEl.setAttribute("y", `${id * getFontHeight()}px`);
	svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");

	const defsEl = document.createElementNS("http://www.w3.org/2000/svg", "defs");
	svgEl.appendChild(defsEl);

	const maskEl = document.createElementNS("http://www.w3.org/2000/svg", "mask");
	maskEl.id = `mask-${id}`;
	defsEl.appendChild(maskEl);

	const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
	textEl.setAttribute("x", "50%");
	textEl.setAttribute("y", getFontWidth());
	textEl.setAttribute("dominant-baseline", "middle");
	textEl.setAttribute("text-anchor", "middle");
	textEl.classList.add("fill-white", "rectBlock", "textBlock");
	textEl.id = `text-${id}`;
	textEl.textContent = generateBinary();
	maskEl.appendChild(textEl);

	const rectBlock3 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectBlock3.setAttribute("class", "fill-white rectBlock");
	svgEl.appendChild(rectBlock3);

	const rectBlock1El = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectBlock1El.classList.add(
		"fill-black",
		`animate-[marquee1_${speed}s_linear_infinite]`,
		"rectBlock"
	);
	rectBlock1El.style.mask = `url(#mask-${id})`;
	svgEl.appendChild(rectBlock1El);

	const rectBlock2El = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	rectBlock2El.classList.add(
		"fill-black",
		`animate-[marquee2_${speed}s_linear_infinite]`,
		"rectBlock"
	);
	rectBlock2El.style.mask = `url(#mask-${id})`;
	svgEl.appendChild(rectBlock2El);

	return svgEl;
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

// Update binary strings
async function updateStrings() {
	let delay = 1;
	for (let i = 0; i < addRowNum; i++) {
		getElementById(`text-${i}`).textContent = generateBinary(
			getElementById(`text-${i}`).textContent
		);
	}
	do {
		delay -= 1;
		await sleep(200);
	} while (delay > 0);
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
	await sleep(500);
	updateCombo();
});
