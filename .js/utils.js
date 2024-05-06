import * as THREE from "three";

export const isWindows = /Windows/i.test(navigator.userAgent),
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
		varying vec2      vUv;
		uniform vec4      iDate; 
		` +
		e
			.replace("mainImage(out vec4 fragColor, in vec2 fragCoord)", "mainImage(in vec2 fragCoord)")
			.replaceAll("fragColor", "gl_FragColor") +
		`
		void main()
		{
			vec2 fragCoord = vec2(gl_FragCoord.x, gl_FragCoord.y);
			mainImage(fragCoord);
		}
		`,
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
					resolve(URL == "" ? "" : reader.result);
				})
				.catch((error) => reject(error));
		}),
	isVideoEle = (ele) => ele.tagName === "VIDEO",
	isImageEle = (ele) => ele.tagName === "IMG",
	isBody = (ele) => document.body === ele,
	isSupportsCSSText = getComputedStyle(document.body).cssText !== "",
	copyCSS = (elem, origElem) => {
		var computedStyle = getComputedStyle(origElem);
		if (isSupportsCSSText) {
			elem.style.cssText = computedStyle.cssText;
		} else {
			for (var prop in computedStyle) {
				if (
					isNaN(parseInt(prop, 10)) &&
					typeof computedStyle[prop] !== "function" &&
					!/^(cssText|length|parentRule)$/.test(prop)
				) {
					elem.style[prop] = computedStyle[prop];
				}
			}
		}
	},
	inlineStyles = (elem, origElem) => {
		var children = elem.querySelectorAll("*"),
			origChildren = origElem.querySelectorAll("*");
		copyCSS(elem, origElem, 1);
		Array.prototype.forEach.call(children, (child, i) => copyCSS(child, origChildren[i]));
		elem.style.margin =
			elem.style.marginLeft =
			elem.style.marginTop =
			elem.style.marginBottom =
			elem.style.marginRight =
				"";
	},
	DOMtoImg = (origElem, width, height, left, top) => {
		(left = left || 0), (top = top || 0);

		var elem = origElem.cloneNode(true);
		inlineStyles(elem, origElem);
		elem.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
		var outerDiv = document.createElement("div");
		(outerDiv.style.position = "absolute"), (outerDiv.style.display = "flex");
		outerDiv.appendChild(elem);
		elem.style.opacity = "1";

		var dataUri =
			"data:image/svg+xml;base64," +
			btoa(`
					<svg xmlns='http://www.w3.org/2000/svg' 
						width='${(width || origElem.clientWidth) + left}'
						height='${(height || origElem.clientHeight) + top}'
					>
						<foreignObject width='100%' height='100%' x='${left}' y='${top}'>	
							${new XMLSerializer().serializeToString(outerDiv)}
						</foreignObject>
					</svg>`);

		return new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener("load", () => resolve(image));
			image.addEventListener("error", () => reject(new Error("Failed to load image")));
			image.src = dataUri;
		});
	};
export class GLSLElement {
	async setDOMSize() {
		const { clientWidth, clientHeight } = this.referenceSize;
		this.size.set(clientWidth, clientHeight, window.devicePixelRatio);
	}

	constructor(
		element,
		setupBuffer = async () => {
			this.bf = await this.initBuffer(true, "../.frag/debug.frag", "");
		},
		setupChannel = async () => {},
		backgroundColor = "transparent"
	) {
		this.setupBuffer = setupBuffer;
		this.setupChannel = setupChannel;
		return new Promise(async (resolve) => {
			this.originalElement = ele(element);

			// Init GLSL
			this.referenceSize = this.originalElement;
			this.size = new THREE.Vector3();
			this.renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
			this.mousePosition = new THREE.Vector4();

			if (!isBody(this.originalElement)) {
				this.outerDiv = document.createElement("div");
				var outerOuterDiv = document.createElement("div");

				this.outerDiv.style.position = "relative";
				this.outerDiv.style.display = "flex";

				outerOuterDiv.style.display = "contents";
				outerOuterDiv.style.position = "relative";

				this.originalElement.parentNode.insertBefore(outerOuterDiv, this.originalElement);
				if (isVideoEle(ele(element))) {
					this.mainChannel = new THREE.VideoTexture(ele(element));
				} else if (isImageEle(ele(element))) {
					this.mainChannel = new THREE.Texture(ele(element));
					this.mainChannel.needsUpdate = true;
				} else {
					this.canvas = document.createElement("canvas");
					this.canvasCTX = this.canvas.getContext("2d");

					this.mainChannel = new CanvasBuffer(this.canvas, this.canvasCTX, this.originalElement);
					this.mainChannel.render();
				}

				this.originalElement.style.opacity = "0";
				this.outerDiv.appendChild(this.renderer.domElement);
				this.outerDiv.appendChild(this.originalElement);
				outerOuterDiv.appendChild(this.outerDiv);
			} else {
				resolve(this);
				return;
			}

			this.setDOMSize();

			// Append canvas to body
			this.renderer.setSize(this.size.x, this.size.y);
			this.renderer.domElement.style.position = "absolute";
			this.renderer.domElement.style.top = "0";
			this.renderer.domElement.style.backgroundColor = backgroundColor;

			// Setup events
			this.renderer.domElement.addEventListener("mousedown", () => this.mousePosition.setZ(1));
			this.renderer.domElement.addEventListener("mouseup", () => this.mousePosition.setZ(0));
			this.renderer.domElement.addEventListener("mousemove", (event) => {
				const rect = event.target.getBoundingClientRect();
				this.mousePosition.setX(event.clientX - rect.left);
				this.mousePosition.setY(this.size.y - event.clientY + rect.top);
			});

			await this.setupBuffer(this);
			this.animate();
			resolve(this);
		});
	}

	async initBuffer(isMainCamera, fragmentShaderURL, commonURL, iC0 = null, iC1 = null, iC2 = null, iC3 = null) {
		return new GLSLBuffer(
			isMainCamera,
			(await fetchFromURL(commonURL)) + ShaderToyToGLSL(await fetchFromURL(fragmentShaderURL)),
			this.renderer,
			this.size,
			{
				iFrame: { value: 0 },
				iResolution: { value: this.size },
				iChannelResolution: {
					value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
				},
				iMouse: { value: this.mousePosition },
				iChannel0: { value: iC0 },
				iChannel1: { value: iC1 },
				iChannel2: { value: iC2 },
				iChannel3: { value: iC3 },
				iTime: { type: "f", value: 0.1 },
				iDate: { value: new THREE.Vector4() },
			}
		);
	}

	async setupBuffer() {
		// Init a buffer
		// this.<bufferName> = await this.initBuffer(isMainCamera: boolean, URL: string, ..iChannel[0..3])
		// 		isMainCamera: if this is the main to show then true else false
		// 		URL: the url to load the fragment shader
		// 		iChannel[0..3]: the channel to render with buffer
	}

	async setupChannel() {
		// Modify buffer channel by using menthod this.<bufferName>.setChannel(number: int, this.<targetBuffer>)
	}

	async animate() {
		requestAnimationFrame(async () => {
			this.setupChannel(this);
			for (let e in this) {
				try {
					eval(`this.${e}.render()`);
				} catch (error) {}
			}

			this.setDOMSize();
			this.animate();
		});
	}
}

class GLSLBuffer {
	constructor(isMainCamera, fragmentShader, renderer, size, uniforms = {}) {
		this.isMainCamera = isMainCamera;
		this.renderer = renderer;
		this.size = size;
		this.counter = 0;
		this.uniforms = uniforms;
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		this.geometry = new THREE.PlaneGeometry(size.x, size.y);
		this.material = new THREE.ShaderMaterial({
			fragmentShader: fragmentShader,
			vertexShader: vertexShader,
			uniforms: this.uniforms,
		});

		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.plane.receiveShadow = true;
		this.plane.position.x = this.plane.position.y = this.plane.position.z = 0;

		this.scene.add(this.plane);

		// Setup camera
		this.camera = new THREE.PerspectiveCamera(1, size.x / size.y, 0.1, 1000);
		this.camera.position.x = this.camera.position.y = 0;
		this.camera.position.z = 100;

		// Buffer section
		this.readBuffer = new THREE.WebGLRenderTarget(size.x, size.y, {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
			stencilBuffer: false,
		});

		this.writeBuffer = this.readBuffer.clone();
	}

	async setChannel(number, buffer) {
		this.uniforms[`iChannel${number}`].value = buffer.readBuffer.texture;
		this.uniforms.iChannelResolution.value[number] = buffer.uniforms.iResolution.value;
	}

	async swap() {
		const temp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = temp;
	}

	async render() {
		if (this.isMainCamera) {
			this.camera.lookAt(this.scene.position);
			this.renderer.render(this.scene, this.camera);
			this.renderer.setSize(this.size.x, this.size.y);
			this.camera.aspect = this.size.x / this.size.y;
			this.camera.updateProjectionMatrix();
		} else {
			this.writeBuffer.setSize(this.size.x, this.size.y);
			this.renderer.setRenderTarget(this.writeBuffer);
			this.renderer.clear();
			this.renderer.render(this.scene, this.camera);
			this.renderer.setRenderTarget(null);
		}

		// Update uniforms data
		this.uniforms.iTime.value += this.clock.getDelta();
		this.uniforms.iFrame.value = this.counter++;

		this.swap();
	}
}
class CanvasBuffer extends THREE.CanvasTexture {
	constructor(canvas, ctx, element) {
		super(canvas);
		this.element = element;
		this.canvas = canvas;
		this.ctx = ctx;
	}

	async render() {
		try {
			await DOMtoImg(this.element).then((img) => {
				(this.canvas.width = img.width), (this.canvas.height = img.height);
				this.ctx.drawImage(img, 0, 0);
			});
		} catch (error) {}

		this.dispose();
	}
}
