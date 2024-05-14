import {
	getRandomInt,
	delay,
	getIdsHasSubString,
	ele,
	abs,
	RGBToHex,
	HexToRgb,
	isWindows,
	fetchFromURL,
} from "./utils.js";

// Export const
window.luckyColor = [getRandomInt(13) - 6, getRandomInt(13) - 6, getRandomInt(13) - 6];

// Local utils
export const updateClass = (obj, prefix, main, suffix = "") => {
	try {
		const classes = obj.classList;
		classes.remove(classes[classes.length - 1]);
		classes.add(`${prefix}-[${main}]${suffix}`);
	} catch (error) {}
};

// Local const
const dynamicDuration = 140000,
	myName = "Nguyễn Việt Anh",
	myNickName = "Takahashi",
	hashTag = "1*10^-36%";

// Dynamic variables
let imageBackgroundBrightness = 0,
	textNameColor = "",
	images = [];
window.randomImageDelayLeft = 0;

// Local values' initations
Promise.all(
	[
		"Aiguille du Midi",
		"Akiyoshidai",
		"Bueng Si Fai",
		"California",
		"CaoBằng",
		"Carinthia",
		"Centre-ValDeLoire",
		"Civita di Bagnoregio",
		"Corfu",
		"crescent",
		"CátBà",
		"Dolbadarn",
		"Dorset",
		"Dorset_1",
		"Dugongs",
		"Dunnottar",
		"Emirgan",
		"Grundlsee",
		"Hague",
		"Halnaker",
		"Happisburgh",
		"HCMUS",
		"Heidelberg",
		"Hibara",
		"Hocking",
		"HoàngCungTokyo",
		"HồYamanaka",
		"Iceland.1",
		"Iceland",
		"ISS",
		"Iwakuni",
		"Killarnery",
		"Lingmoor",
		"Lofoten",
		"LâuĐàiHimeji",
		"Marseille",
		"Namib",
		"namibia",
		"New hampshire",
		"Nusa",
		"Petit Minou",
		"Raja Ampat",
		"Sechura",
		"Shikotsu-Toya",
		"Suffolk",
		"Sweden",
		"SôngCửuLong",
		"Tekapo",
		"Tenerife",
		"the ruhr",
		"Trinidad",
		"UnionSquare",
		"VũngNapa",
		"Yellowstone",
	].map(async (imageName) => {
		return await fetchFromURL(
			`https://TakahashiNguyen.github.io/TakahashiNguyen/.webp/${imageName}.webp`,
			true
		);
	})
).then((values) => {
	images = values;
});

// Replace background image
async function randomImage(dur, loop = false) {
	var currentIndex = images.indexOf(ele("myImg").src);
	randomImageDelayLeft = 100;
	do {
		var newIndex = getRandomInt(images.length);
	} while (newIndex == currentIndex);
	var data = images[newIndex];
	var bool = data != null;

	if (bool) {
		await Promise.all([
			fade(ele("myImg"), (dur * 7) / 100, 1, 0),
			fade(ele("textDivSub"), (dur * 3) / 100, 0, 1),

			fade(ele("textDiv"), (dur * 5) / 100, 1, 0),
			fade(ele("githubSpin"), (dur * 2) / 100, 1, 0),
		]);

		ele("myImg").setAttribute("src", data);
		try {
			mySpotify.src += "";
		} catch (error) {}

		await Promise.all([
			fade(ele("myImg"), (dur * 7) / 100, 0, 1),
			fade(ele("textDivSub"), (dur * 3) / 100, 1, 0),

			fade(ele("textDiv"), (dur * 5) / 100, 0, 1),
			fade(ele("githubSpin"), (dur * 2) / 100, 0, 1),
		]);
	}
	if (bool) {
		do {
			randomImageDelayLeft -= 1;
			await delay((dur / 100) * 0.74);
		} while (randomImageDelayLeft > 0);
	} else await delay(100);
	if (loop) randomImage(dur, true);
}

// Update text decoration
function updateTextDecoration() {
	updateClass(ele("githubSpin"), "outline", textNameColor);

	const updateColor = (imageBackgroundBrightness > 128 ? 1 : -1) * 74;
	const color = RGBToHex(...HexToRgb(textNameColor, updateColor, updateColor, updateColor));
	const siz = (e) => (textSquareSize / (1941 * 2)) * e;
	ele("textDiv").style.textShadow = `
    ${-siz(1)}px ${siz(1)}px ${siz(1)}px ${color},
    ${-siz(3)}px ${siz(3)}px ${siz(3)}px ${color},
    ${-siz(6)}px ${siz(6)}px ${siz(6)}px ${color},
    ${-siz(10)}px ${siz(10)}px ${siz(10)}px ${color},
    ${-siz(15)}px ${siz(15)}px ${siz(15)}px ${color}
  `;
	ele("textDiv").style.color = textNameColor;
}

// Fade animation for element
export async function fade(element, duration, from, to, fps = 60, callafter = () => {}) {
	return new Promise(async (resolve) => {
		var l = from,
			i = (from > to ? -1 : 1) * (1 / (duration * (fps / 1000)));
		while (from < to ? l < to : l > to) {
			try {
				element.style.opacity = l;
			} catch (error) {
				resolve();
				return;
			}
			l += i;
			await delay((1 / fps) * 1000);
		}
		element.style.opacity = to;
		callafter();
		resolve();
	});
}

// Text's dynamic size
export async function dynamicTextSizer(name, nickname, hashtag) {
	const { innerHeight, innerWidth } = window;
	try {
		textSquareSize = Math.min(innerHeight, innerWidth);
		if (isBanner) textSquareSize = 650;
	} catch (error) {}

	try {
		name.style.height = name.style.width = `${textSquareSize}px`;
		name.style.lineHeight = name.style.fontSize = `${textSquareSize / 18}px`;

		nickname.style.lineHeight = nickname.style.fontSize = `${textSquareSize / 40}px`;
		hashtag.style.lineHeight = hashtag.style.fontSize = `${textSquareSize / 64}px`;
	} catch (error) {}
}

// Update text color
export function changeTextColor() {
	const canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
	const context = canvas.getContext("2d");
	const canvaSize = Math.min(ele("myImg").width, ele("myImg").height) / 14;
	canvas.width = canvaSize * 11;
	canvas.height = canvaSize * 4;
	var x = (ele("myImg").width - canvas.width) / 2;
	var y = (ele("myImg").height - canvas.height) / 2;

	context.drawImage(ele("myImg"), -x, -y, ele("myImg").width, ele("myImg").height);
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	let r = 0,
		g = 0,
		b = 0,
		avg = 0,
		colorSum = 0;

	for (let i = 0; i < data.length; i += 4) {
		r += data[i];
		g += data[i + 1];
		b += data[i + 2];
		avg = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
		colorSum += avg;
	}

	const brightness = Math.floor(colorSum / (canvas.height * canvas.width));
	const pixelCount = data.length / 4;
	const averageR = abs((brightness < 128 ? 270 : 180) - Math.floor(r / pixelCount));
	const averageG = abs((brightness < 128 ? 270 : 180) - Math.floor(g / pixelCount));
	const averageB = abs((brightness < 128 ? 270 : 180) - Math.floor(b / pixelCount));
	imageBackgroundBrightness = brightness;
	textNameColor = RGBToHex(averageR, averageG, averageB);
	updateTextDecoration();
}

// Special sector
var dynamicInvertal;
const dynamicFunctions = async () => {};
document.addEventListener("visibilitychange", () => {
	if (document.hidden) {
		clearInterval(dynamicInvertal);
	} else {
		dynamicInvertal = setInterval(dynamicFunctions, dynamicDuration);
	}
});

window.addEventListener("DOMContentLoaded", async () => {
	getIdsHasSubString("name").forEach((obj) => (obj.textContent = myName));
	getIdsHasSubString("nickName").forEach((obj) => (obj.textContent = myNickName));
	getIdsHasSubString("myHashTag").forEach(
		(obj) => (obj.textContent = (hashTag !== "" ? "#" : "") + hashTag)
	);

	dynamicInvertal = setInterval(dynamicFunctions, dynamicDuration);
	randomImage(randomImageDuration, true);
	if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
		ele("textDiv").style.color = "black";
});
