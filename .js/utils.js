const isWindows = /Windows/i.test(navigator.userAgent),
	isLinux = /Linux/i.test(navigator.userAgent),
	isMobile = /Mobile/i.test(navigator.userAgent),
	vertexShader = `
      varying vec2 vUv;
			void main()
			{
				vUv = uv;

			  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
			  gl_Position = projectionMatrix * mvPosition;
			}
  `,
	ele = (s) => document.getElementById(s),
	getIdsHasSubString = (s) => document.querySelectorAll(`[id*=${s}]`),
	abs = (v) => Math.abs(v),
	floor = (v) => Math.floor(v),
	getRandomInt = (max) => Math.floor(Math.random() * max),
	delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
	RGBToHex = (r, g, b) =>
		"#" +
		((1 << 24) | (abs(r + luckyColor[0]) << 16) | (abs(g + luckyColor[1]) << 8) | abs(b + luckyColor[2]))
			.toString(16)
			.slice(1),
	HexToRgb = (hex, rr = 0, gg = 0, bb = 0) => {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "#000000");
		return [
			parseInt(result[1], 16) + rr + luckyColor[0],
			parseInt(result[2], 16) + gg + luckyColor[1],
			parseInt(result[3], 16) + bb + luckyColor[2],
		];
	},
	replaceAt = (str, pos, char) => {
		let firstPart = str.substr(0, pos),
			lastPart = str.substr(pos + 1);

		return firstPart + char + lastPart;
	},
	ShaderToyToGLSL = (e) =>
		`
      precision highp   float;
      uniform float     iTime;
			uniform sampler2D iChannel0;
			uniform sampler2D iChannel1;
      uniform int       iFrame;
			uniform vec4      iMouse;
			uniform vec3      iResolution;
      uniform float     iChannelTime[4];
      uniform vec3      iChannelResolution[4]; 
			varying vec2      vUv;` +
		e
			.replace("mainImage(out vec4 fragColor, in vec2 fragCoord)", "main()")
			.replaceAll("fragColor", "gl_FragColor")
			.replaceAll("fragCoord", "gl_FragCoord"),
	fetchFromURL = (URL) =>
		new Promise((resolve, reject) => {
			fetch(URL)
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.blob();
				})
				.then(async (data) => {
					var reader = new FileReader();
					reader.readAsText(data);
					while (reader.readyState != 2) await delay(100);
					resolve(reader.result);
				})
				.catch((error) => reject(error));
		}),
	isVideoEle = (ele) => ele.tagName === "VIDEO";
