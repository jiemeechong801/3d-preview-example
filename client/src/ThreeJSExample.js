import React, { useEffect, useRef } from "react";
import * as THREE from 'three/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Mug from './assets/model1.glb';
import Image1 from './assets/model1_img0.jpg';
import Image2 from './assets/model2_img0.jpg';
import Image3 from './assets/model3_img0.jpg';
import Image4 from './assets/model4_img0.jpg';

let container, camera, scene, renderer, orbitControls, textureButton;

const images = [Image1, Image2, Image3, Image4];

const init = () => {

    scene = new THREE.Scene();

    // Note: The near and far planes can be set this way due to the use of "logarithmicDepthBuffer" in the renderer below.
    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1e-5, 1e10);

    scene.add(camera);

    const hemispheric = new THREE.HemisphereLight(0xffffff, 0x222222, 0.5);
    scene.add(hemispheric);

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setClearColor(0x222222);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    const loader = new GLTFLoader();

    const cameraPos = new THREE.Vector3(-0.2, 0.4, 1.4);
    orbitControls = new OrbitControls(camera, renderer.domElement);

    loader.load(Mug, (gltf) => {
        const object = gltf.scene;

        const pmremGenerator = new THREE.PMREMGenerator( renderer );
        pmremGenerator.compileEquirectangularShader();

        // Center the model on screen based on bounding box information.
        object.updateMatrixWorld();
        const boundingBox = new THREE.Box3().setFromObject(object);
        const modelSizeVec3 = new THREE.Vector3();
        boundingBox.getSize(modelSizeVec3);
        const modelSize = modelSizeVec3.length();
        const modelCenter = new THREE.Vector3();
        boundingBox.getCenter(modelCenter);

        // Set up mouse orbit controls.
        orbitControls.reset();
        orbitControls.maxDistance = modelSize * 50;
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.07;
        orbitControls.rotateSpeed = 1.25;
        orbitControls.panSpeed = 1.25;
        orbitControls.screenSpacePanning = true;
        orbitControls.autoRotate = true;

        // Position the camera accordingly.
        object.position.x = -modelCenter.x;
        object.position.y = -modelCenter.y;
        object.position.z = -modelCenter.z;
        camera.position.copy(modelCenter);
        camera.position.x += modelSize * cameraPos.x;
        camera.position.y += modelSize * cameraPos.y;
        camera.position.z += modelSize * cameraPos.z;
        camera.near = modelSize / 100;
        camera.far = modelSize * 100;
        camera.updateProjectionMatrix();
        camera.lookAt(modelCenter);

        object.traverse((obj) => {
            if ((obj instanceof THREE.Mesh) && obj.name === "Mug_Porcelain_PBR001_0")
            {
                const material = obj.material;
                material.needsUpdate = true;
                material.map = convertImageToTexture(images[0]);

                textureButton.addEventListener('click', () => {
                    const randomElement = images[Math.floor(Math.random() * images.length)];
                    material.map = convertImageToTexture(randomElement);
                })
            }
        })

        scene.add(object);
        onWindowResize();

    }, function(error) {
        // console.error(error);
    });
}

const onWindowResize = () => {

    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

const convertImageToTexture = (image) => {
    const textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load(image);
    texture.encoding = THREE.sRGBEncoding;
    texture.flipY = false;

    return texture;
}

const ThreeJSExample = () => {

    const animate = () => {

        requestAnimationFrame(() => animate());

        orbitControls.update();
        // updateTexture();
        renderer.render(scene, camera);
    }

    const ref = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        container = ref.current;
        textureButton = buttonRef.current;

        const resizeHandler = () => onWindowResize();

        init();
        animate();

        window.addEventListener('resize', resizeHandler, false);

        return () => {
            window.removeEventListener('resize', resizeHandler, false);
        }
    }, [])

    return (
        <div className='preview'>
            <button ref={buttonRef}>Update Texture</button>
            <div ref={ref} />
        </div>
    )
}

export default ThreeJSExample
