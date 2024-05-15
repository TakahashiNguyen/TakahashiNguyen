import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "CSS3DRenderer";

export const isWindows = /Windows/i.test(navigator.userAgent),
	isLinux = /Linux/i.test(navigator.userAgent),
	isMobile = /Mobile/i.test(navigator.userAgent),
	MY_VERTEX_SHADER = `
      varying vec2 vUv;
			void main()
			{
				vUv = uv;

			  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
			  gl_Position = projectionMatrix * mvPosition;
			}
  `,
	getElementById = (id) => document.getElementById(id),
	getElementsWithSubstring = (substring) => document.querySelectorAll(`[id*=${substring}]`),
	abs = (value) => Math.abs(value),
	floor = (value) => Math.floor(value),
	getRandomInt = (max) => Math.floor(Math.random() * max),
	sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
	rgbToHex = (r, g, b) =>
		"#" +
		(
			(1 << 24) |
			(abs(r + luckyColor[0]) << 16) |
			(abs(g + luckyColor[1]) << 8) |
			abs(b + luckyColor[2])
		)
			.toString(16)
			.slice(1),
	hexToRgb = (hex, rr = 0, gg = 0, bb = 0) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "#000000");
		return [
			parseInt(result[1], 16) + rr + luckyColor[0],
			parseInt(result[2], 16) + gg + luckyColor[1],
			parseInt(result[3], 16) + bb + luckyColor[2],
		];
	},
	replaceAt = (str, pos, char) => {
		const firstPart = str.substr(0, pos),
			lastPart = str.substr(pos + 1);

		return firstPart + char + lastPart;
	},
	convertShaderToyToGLSL = (shader) =>
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
		shader
			.replace("mainImage(out vec4 fragColor, in vec2 fragCoord)", "mainImage(in vec2 fragCoord)")
			.replaceAll("fragColor", "gl_FragColor") +
		`
		void main()
		{
			vec2 fragCoord = vec2(gl_FragCoord.x, gl_FragCoord.y);
			mainImage(fragCoord);
		}
		`,
	fetchFromURL = (url, isImage = false) =>
		new Promise((resolve) => {
			if (!url) resolve("");
			fetch(url)
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.blob();
				})
				.then(async (data) => {
					const reader = new FileReader();
					isImage ? reader.readAsDataURL(data) : reader.readAsText(data);
					while (reader.readyState !== 2) await sleep(100);
					resolve(reader.result);
				})
				.catch((error) => resolve(""));
		}),
	isVideoElement = (element) => element.tagName === "VIDEO",
	isImageElement = (element) => element.tagName === "IMG",
	isBodyElement = (element) => document.body === element,
	isDivElement = (element) => element.tagName === "DIV",
	isSupportsCSSText = getComputedStyle(document.body).cssText !== "",
	copyCSS = (element, originalElement) => {
		const computedStyle = getComputedStyle(originalElement);
		if (isSupportsCSSText) {
			element.style.cssText = computedStyle.cssText;
		} else {
			for (const prop in computedStyle) {
				if (
					isNaN(parseInt(prop, 10)) &&
					typeof computedStyle[prop] !== "function" &&
					!/^(cssText|length|parentRule)$/.test(prop)
				) {
					element.style[prop] = computedStyle[prop];
				}
			}
		}
	},
	inlineStyles = (element, originalElement) => {
		const children = Array.from(element.querySelectorAll("*")),
			origChildren = Array.from(originalElement.querySelectorAll("*"));
		copyCSS(element, originalElement, 1);
		children.forEach((child, i) => copyCSS(child, origChildren[i]));
		element.style.margin =
			element.style.marginLeft =
			element.style.marginTop =
			element.style.marginBottom =
			element.style.marginRight =
				"";
	},
	DOMtoImg = (originalElement, width, height, left, top) => {
		left || (left = 0), top || (top = 0);

		const elem = originalElement.cloneNode(true);
		inlineStyles(elem, originalElement);
		elem.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
		const outerDiv = document.createElement("div");
		(outerDiv.style.position = "absolute"), (outerDiv.style.display = "flex");
		outerDiv.appendChild(elem);
		elem.style.opacity = "1";

		const dataUri =
			"data:image/svg+xml;base64," +
			btoa(`
				<svg xmlns='http://www.w3.org/2000/svg' 
					width='${(width || origElem.clientWidth) + left}'
					height='${(height || origElem.clientHeight) + top}'
				>
					<foreignObject width='100%' height='100%' x='${left}' y='${top}'>	
						${new XMLSerializer().serializeToString(outerDiv)}
					</foreignObject>
				</svg>
			`);

		return new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener("load", () => resolve(image));
			image.addEventListener("error", () => reject(new Error("Failed to load image")));
			image.src = dataUri;
		});
	};

export class GLSLElement {
	async setDOMSize() {
		const { clientWidth, clientHeight } = this.referenceSizeElement;
		this.size.set(clientWidth, clientHeight, window.devicePixelRatio);
		if (this.referenceSizeElement !== this.originalElement) {
			this.innerInnerDiv.style.width = `${clientWidth}px`;
			this.innerInnerDiv.style.height = `${clientHeight}px`;
		}
	}

	makeRenderer(make, backgroundColor) {
		const renderer = make();
		renderer.setSize(this.size.x, this.size.y);
		renderer.domElement.style.backgroundColor = backgroundColor;
		renderer.domElement.style.top = renderer.domElement.style.left = 0;
		renderer.domElement.style.position = "absolute";
		return renderer;
	}

	constructor(
		element,
		setupBuffer = async () => {},
		setupChannel = async () => {},
		backgroundColor = "transparent"
	) {
		this.setupBuffer = setupBuffer;
		this.setupChannel = setupChannel;
		return new Promise(async (resolve) => {
			this.originalElement = getElementById(element);

			// Init GLSL
			this.referenceSizeElement = this.originalElement;
			this.size = new THREE.Vector3();
			this.rendererGL = this.makeRenderer(
				() => new THREE.WebGLRenderer({ preserveDrawingBuffer: true }),
				backgroundColor
			);
			this.renderer = this.makeRenderer(() => new CSS3DRenderer(), backgroundColor);
			this.mousePosition = new THREE.Vector4();

			if (!isBodyElement(this.originalElement)) {
				var outerOuterDiv = document.createElement("div"),
					outerDiv = document.createElement("div");

				outerDiv.append(this.renderer.domElement, this.rendererGL.domElement);
				(this.rendererGL.domElement.style.zIndex = 1), (this.renderer.domElement.style.zIndex = 2);
				(outerDiv.style.position = "relative"), (outerDiv.style.display = "flex");
				(outerOuterDiv.style.position = "relative"), (outerOuterDiv.style.display = "contents");

				this.originalElement.parentNode.insertBefore(outerOuterDiv, this.originalElement);
				outerOuterDiv.appendChild(outerDiv);
				if (isVideoElement(getElementById(element))) {
					this.mainChannel = await this.initBuffer(
						false,
						new THREE.VideoTexture(getElementById(element))
					);
					this.renderer.domElement.style.display = "none";
				} else if (isImageElement(getElementById(element))) {
					var mat = new THREE.Texture(getElementById(element));
					mat.needsUpdate = true;
					this.mainChannel = await this.initBuffer(false, mat);
					this.renderer.domElement.style.display = "none";
				} else {
					this.innerInnerDiv = document.createElement("div");
					this.referenceSizeElement = outerDiv;

					// this.canvas = document.createElement("canvas");
					// this.canvasCTX = this.canvas.getContext("2d");

					this.innerInnerDiv.append(...this.originalElement.children);
					for (var property in this.originalElement.style) {
						if (property.toLowerCase().includes("color")) {
							this.innerInnerDiv.style[property] = this.originalElement.style[property];
							this.originalElement.style[property] = "";
						}
					}

					this.originalElement.appendChild(outerOuterDiv);
					outerDiv.style.width = outerDiv.style.height = "100%";

					this.mainChannel = await this.initBuffer(
						true,
						//new CanvasBuffer(this.canvas, this.canvasCTX, this.originalElement)
						this.innerInnerDiv
					);
				}
			} else {
				resolve(this);
				return;
			}

			this.setDOMSize();

			// Setup events
			outerDiv.addEventListener("mousedown", () => this.mousePosition.setZ(1));
			outerDiv.addEventListener("mouseup", () => this.mousePosition.setZ(0));
			outerDiv.addEventListener("mousemove", (event) => {
				const rect = event.target.getBoundingClientRect();
				this.mousePosition.setX(event.clientX - rect.left);
				this.mousePosition.setY(this.size.y - event.clientY + rect.top);
			});

			await this.setupBuffer(this);
			const animate = () => {
				requestAnimationFrame(animate);
				this.setupChannel(this);
				for (let e in this) {
					try {
						eval(`this.${e}.render()`);
					} catch (error) {}
				}

				this.setDOMSize();
			};
			animate();
			resolve(this);
		});
	}

	async initBuffer(isMainCamera, input) {
		return new ElementBuffer(isMainCamera, input, this.renderer, this.rendererGL, this.size, {
			iFrame: { value: 0 },
			iResolution: { value: this.size },
			iChannelResolution: {
				value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
			},
			iMouse: { value: this.mousePosition },
			iChannel0: { value: null },
			iChannel1: { value: null },
			iChannel2: { value: null },
			iChannel3: { value: null },
			iTime: { type: "f", value: 0.1 },
			iDate: { value: new THREE.Vector4() },
		});
	}

	async setupBuffer() {
		// Init a buffer
		// this.<bufferName> = await this.initBuffer(isMainCamera: boolean, URL: string)
		// 		isMainCamera: if this is the main to show then true else false
		// 		URL: the url to load the fragment shader
		// 		iChannel[0..3]: the channel to render with buffer
	}

	async setupChannel() {
		// Modify buffer channel by using menthod
		// 		this.<bufferName>.setChannel(number: int, this.<targetBuffer>)
	}
}

class ElementBuffer {
	constructor(isMainCamera, input, renderer, rendererGL, size, uniforms = {}) {
		return new Promise(async (resolve) => {
			this.isMainCamera = isMainCamera;
			if (input instanceof THREE.Texture) {
				(this.isTexture = true), (this.readBuffer = { texture: input });
			} else if (typeof input === "string" || input instanceof String || isDivElement(input)) {
				(this.renderer = renderer), (this.rendererGL = rendererGL), (this.size = size);
				(this.frameCounter = 0), (this.uniforms = uniforms), (this.clock = new THREE.Clock());
				this.scene = new THREE.Scene();
				if (!isDivElement(input)) {
					const commonFilePath = () => {
						let arr = input.split("/");
						arr[arr.length - 1] = "_common.frag";
						return arr.join("/");
					};

					this.material = new THREE.ShaderMaterial({
						fragmentShader:
							(await fetchFromURL(commonFilePath())) +
							convertShaderToyToGLSL(await fetchFromURL(input)),
						vertexShader: MY_VERTEX_SHADER,
						uniforms: this.uniforms,
					});
					this.isFragment = true;
				} else {
					const object = new CSS3DObject(input);
					object.scale.set(1.19125, 1.19125, 1);

					this.scene.add(object);

					this.material = new THREE.MeshBasicMaterial({
						color: new THREE.Color("green"),
					});
				}

				this.geometry = new THREE.PlaneGeometry(size.x, size.y);
				(this.plane = new THREE.Mesh(this.geometry, this.material)),
					(this.plane.receiveShadow = true),
					(this.plane.position.x = this.plane.position.y = this.plane.position.z = 0);
				this.scene.add(this.plane);

				// Setup camera
				this.camera = new THREE.PerspectiveCamera(
					isDivElement(input) ? 100 : 1,
					size.x / size.y,
					0.1,
					1000
				);
				(this.camera.position.x = this.camera.position.y = 0), (this.camera.position.z = 100);

				// Buffer section
				this.readBuffer = new THREE.WebGLRenderTarget(size.x, size.y, {
					type: THREE.FloatType,
					stencilBuffer: true,
				});
				this.writeBuffer = this.readBuffer.clone();
			}
			resolve(this);
		});
	}

	async setChannel(number, buffer) {
		this.uniforms[`iChannel${number}`].value = buffer.readBuffer.texture;
		this.uniforms.iChannelResolution.value[number] = buffer.size;
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
			this.rendererGL.render(this.scene, this.camera);
			this.rendererGL.setSize(this.size.x, this.size.y);
			this.camera.aspect = this.size.x / this.size.y;
			this.camera.updateProjectionMatrix();
		} else if (this.isFragment) {
			this.writeBuffer.setSize(this.size.x, this.size.y);
			this.rendererGL.setRenderTarget(this.writeBuffer);
			this.rendererGL.clear();
			this.rendererGL.render(this.scene, this.camera);
			this.renderer.render(this.scene, this.camera);
			this.renderer.setSize(this.size.x, this.size.y);
			this.rendererGL.setRenderTarget(null);
			this.swap();

			// Update uniforms data
			this.uniforms.iTime.value += this.clock.getDelta();
			this.uniforms.iFrame.value = this.frameCounter++;
		} else if (this.isTexture && this.readBuffer.texture instanceof CanvasBuffer)
			this.readBuffer.texture.render();
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

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};
