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
	isVideoEle = (ele) => ele.tagName === "VIDEO",
	isImageEle = (ele) => ele.tagName === "IMG";
class GLSLElement {
	setDOMSize() {
		const { clientWidth, clientHeight } = this.outerElement;
		this.size.set(clientWidth, clientHeight);
	}

	constructor(element = "body") {
		return new Promise(async (resolve) => {
			if (element != "body") {
				if (isVideoEle(ele(element))) {
					while (ele(element).readyState < 2) await delay(100);
					this.mainChannel = new THREE.VideoTexture(ele(element));
				} else if (isImageEle(ele(element))) {
					while (ele(element).readyState < 2) await delay(100);
					this.mainChannel = new THREE.Texture(ele(element));
					this.mainChannel.needsUpdate = true;
				}
				var originalElement = ele(element);
				var outerDiv = document.createElement("div");
				var outerOuterDiv = document.createElement("div");

				outerDiv.setAttribute("id", `outer-${element}`);
				outerDiv.style.position = "relative";

				outerOuterDiv.style.display = "contents";

				originalElement.parentNode.insertBefore(outerOuterDiv, originalElement);
				originalElement.style.opacity = "0";
				outerDiv.appendChild(originalElement);
				outerOuterDiv.appendChild(outerDiv);
			}

			// Init GLSL
			this.outerElement = ele(`outer-${element}`);
			this.size = new THREE.Vector2();
			this.renderer = new THREE.WebGLRenderer();
			this.mousePosition = new THREE.Vector4();

			this.setDOMSize();

			// Append canvas to body
			this.renderer.setSize(this.size.width, this.size.height);
			this.renderer.domElement.style.position = "absolute";
			this.renderer.domElement.style.top = "0";
			this.outerElement.appendChild(this.renderer.domElement);

			// Setup events
			this.renderer.domElement.addEventListener("mousedown", () => this.mousePosition.setZ(1));
			this.renderer.domElement.addEventListener("mouseup", () => this.mousePosition.setZ(0));
			this.renderer.domElement.addEventListener("mousemove", (event) => {
				const rect = event.target.getBoundingClientRect();
				this.mousePosition.setX(event.clientX - rect.left);
				this.mousePosition.setY(this.size.height - event.clientY + rect.top);
			});

			this.start();
			resolve(this);
		});
	}

	async initBuffer(isMainCamera, fragmentShaderURL, iC0 = null, iC1 = null, iC2 = null, iC3 = null) {
		return new GLSLBuffer(
			isMainCamera,
			ShaderToyToGLSL(await fetchFromURL(fragmentShaderURL)),
			this.renderer,
			this.size,
			{
				iFrame: { value: 0 },
				iResolution: { value: new THREE.Vector3(this.size.width, this.size.height, window.devicePixelRatio) },
				iChannelResolution: {
					value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
				},
				iMouse: { value: this.mousePosition },
				iChannel0: { value: iC0 },
				iChannel1: { value: iC1 },
				iChannel2: { value: iC2 },
				iChannel3: { value: iC3 },
				iTime: { type: "f", value: 0.1 },
			}
		);
	}

	async start() {
		// Init a buffer
		// this.<bufferName> = await this.initBuffer(isMainCamera: boolean, URL: string, ..iChannel[0..3])
		// 		isMainCamera: if this is the main to show then true else false
		// 		URL: the url to load the fragment shader
		// 		iChannel[0..3]: the channel to render with buffer

		this.animate();
	}

	animate() {
		requestAnimationFrame(async () => {
			// Modify buffer channel by using menthod this.<bufferName>.setChannel(number: int, this.<targetBuffer>)
			// (Require) this.<bufferName>.render()

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
		this.geometry = new THREE.PlaneBufferGeometry(size.width, size.height);
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
		this.camera = new THREE.PerspectiveCamera(1, this.size.width / this.size.height, 0.1, 1000);
		this.camera.position.x = this.camera.position.y = 0;
		this.camera.position.z = 100;

		// Buffer section
		this.readBuffer = new THREE.WebGLRenderTarget(size.width, size.height, {
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
			this.renderer.render(this.scene, this.camera);
			this.camera.lookAt(this.scene.position);
		} else {
			this.renderer.setRenderTarget(this.writeBuffer);
			this.renderer.clear();
			this.renderer.render(this.scene, this.camera);
			this.renderer.setRenderTarget(null);
		}

		// Dynamic sizing
		this.camera.aspect = this.size.width / this.size.height;
		this.camera.updateProjectionMatrix();
		this.uniforms.iResolution.value = new THREE.Vector3(this.size.width, this.size.height, window.devicePixelRatio);
		this.renderer.setSize(this.size.width, this.size.height);

		// Update uniforms data
		this.uniforms.iTime.value += this.clock.getDelta();
		this.uniforms.iFrame.value = this.counter++;

		this.swap();
	}
}
