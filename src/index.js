import { Scene } from "three/src/scenes/Scene";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { Mesh } from "three/src/objects/Mesh";
import { DirectionalLight } from "three/src/lights/DirectionalLight";
import { AmbientLight } from "three/src/lights/AmbientLight";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Clock } from "three/src/core/Clock";
import { SphereGeometry } from "three";
import { BoxGeometry } from "three";
import { RGBAFormat } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { DoubleSide } from "three/src/constants";
import { Color } from "three/src/math/Color";
import { Fog } from "three/src/scenes/Fog";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";

const sound = document.createElement("audio");
//sound.setAttribute("controls", true);
sound.src = "./audio/loop1.mp3";
document.body.appendChild(sound);

const canvas = document.querySelector("#canvas1");

const scene = new Scene();
scene.background = new Color("black");
//scene.fog = new Fog(new Color(0xffd6fc), 15, 40);

const clock = new Clock();

const directionalLight = new DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-1, 1, 2);
const ambientLigth = new AmbientLight(0xffffff, 0.4);

const camera = new PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.z = 5;

//const planeGeometry = new SphereGeometry(5, 80, 80);
const planeGeometry = new PlaneGeometry(5, 5, 80, 80);
const floorGeometry = new PlaneGeometry(100, 100, 80, 80);

const customMaterial = new ShaderMaterial({
	uniforms: {
		u_time: { value: 0 },
	},
	fragmentShader: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    varying float z;
    varying float a;
    varying vec3 pos;
    
    void main() {    
      gl_FragColor = vec4(.8, cos(u_time) * a, a * 1.3,1.0);
    //gl_FragColor = vec4(a * sin(u_time), cos(u_time) / a, a,1.0);
    }`,
	vertexShader: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    varying float z;
    varying float a;
    varying vec3 pos;
    
    void main() {
        pos = position;

        float b = 1. + cos(u_time) * position.x  ;
        z = sin(u_time) * position.x / position.y;
        a = sin((position.x ) * (position.y + sin(u_time / 3.) * 6.)) / 3.;
      //  a = sin((position.x ) * (position.y + sin(u_time / 3.) * 6.)) / atan(sin(u_time) + .5);

        


        gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, a, 1.0 );
    }`,
});
customMaterial.side = DoubleSide;

const customMaterial2 = new ShaderMaterial({
	uniforms: {
		u_time: { value: 0 },
	},
	fragmentShader: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    varying float z;
    varying float a;
    varying vec3 pos;
    
    void main() {    
      //gl_FragColor = vec4(.8, cos(u_time) * a, a * 1.3,1.0);
      gl_FragColor = vec4(cos(u_time) / a, cos(u_time) / a, cos(u_time) / a,1.0);
    }`,
	vertexShader: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    varying float z;
    varying float a;
    varying vec3 pos;
    
    void main() {
        pos = position;

        float b = 1. + cos(u_time) * position.x  ;
        z = sin(u_time) * position.x / position.y;
        a = sin((position.x ) * (position.y + sin(u_time / 3.) * 6.)) / 3.;
      //  a = sin((position.x ) * (position.y + sin(u_time / 3.) * 6.)) / atan(sin(u_time) + .5);

        


        gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, a, 1.0 );
    }`,
});
customMaterial2.side = DoubleSide;

const floorMaterial = new MeshStandardMaterial({ color: "black" });

const planeMesh1 = new Mesh(planeGeometry, customMaterial);
planeMesh1.position.set(-4, 2, 0);
const floorMesh1 = new Mesh(floorGeometry, customMaterial2);
//floorMesh1.rotation.x = Math.PI / 2;
floorMesh1.position.z = -150;

scene.add(ambientLigth);
scene.add(directionalLight);
scene.add(planeMesh1);
scene.add(floorMesh1);

const renderer = new WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, canvas);
controls.listenToKeyEvents(window);
controls.keyPanSpeed = 20;
controls.enableDamping = true;
controls.dampingFactor = 0.5;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const fxaaPass = new ShaderPass(FXAAShader);
composer.addPass(fxaaPass);

const unrealBloomPass = new UnrealBloomPass({}, 0.8, 0.7, 0.1);
unrealBloomPass.renderToScreen = true;
composer.addPass(unrealBloomPass);

renderer.setSize(canvas.width, canvas.height, false);

function animate() {
	planeMesh1.rotation.y = clock.getElapsedTime() * 0.5;
	customMaterial.uniforms.u_time.value = clock.getElapsedTime();
	customMaterial2.uniforms.u_time.value = clock.getElapsedTime();
	requestAnimationFrame(animate);
	controls.update();
	composer.render(scene, camera);
	//	renderer.render(scene, camera);
}
animate();
