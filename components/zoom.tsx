import * as Three from "three";
import React, {useCallback, useEffect, useRef} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default function Zoom () {
  const totalArtworks = useRef(100);
  const artworksGroup = useRef(new Three.Object3D());
  const pageNum = useRef(0);
  const moveBezier = useRef(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scene = useRef<Three.Scene>(new Three.Scene());
  const camera = useRef<Three.PerspectiveCamera>(new Three.PerspectiveCamera(80, window.innerWidth /window.innerHeight, 0.1, 10000));
  const renderer = useRef<Three.WebGLRenderer>(new Three.WebGLRenderer({ antialias: true }));
  const controls = useRef<OrbitControls>(new OrbitControls(camera.current, renderer.current.domElement))

  const addArtwork = useCallback((i: number) => {
    const imageMap = new Three.TextureLoader().load(`https://source.unsplash.com/collection/${i}`);
    const geometry = new Three.BoxGeometry(32,18, 1);
    const material = new Three.MeshPhongMaterial({ map: imageMap });
    const boxMesh = new Three.Mesh(geometry, material);

    boxMesh.position.set(Math.random() * 200 - 200 / 2, Math.random() * 100 - 100 / 2, i * 30);
    artworksGroup.current.add(boxMesh);
  }, []);

  const addLight = (x: number, y: number, z: number) => {
    const color = 0xffffff;
    const intensity = 0.4;
    const light = new Three.PointLight(color, intensity);
    light.castShadow = true;

    light.position.set(x, y, z);
    const helper = new Three.PointLightHelper(light);
    scene.current.add(helper, light);
  }

  const init = useCallback(() => {
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setClearColor(0x000000);
    canvasRef.current?.appendChild(renderer.current.domElement);
    // camera.current.position.set(-50, 20, -40);
    camera.current.position.set(20, 0, -50);
    renderer.current.shadowMap.enabled = true;

    const near = 100;
    const far = 300;
    const color = "#000000";
    scene.current.fog = new Three.Fog(color, near, far);

    // const axes = new Three.AxesHelper(150);
    // const gridHelper = new Three.GridHelper(240, 20);
    // scene.current.add(axes, gridHelper);

    const light = new Three.HemisphereLight(0xffffff, 0x080820, 0.8);
    light.position.set(100, 100, 0);
    scene.current.add(light);

    controls.current.enableZoom = false;

    for (let i = 0; i <= totalArtworks.current; i++) addArtwork(i);
    scene.current.add(artworksGroup.current);
    addLight(0, 16, -20);
  }, [addArtwork]);

  const animate = useCallback(() => {
    moveBezier.current += (-pageNum.current * 30 - moveBezier.current) * 0.07;
    artworksGroup.current.position.z = moveBezier.current;

    camera.current.lookAt(scene.current.position);
    camera.current.updateProjectionMatrix();
    renderer.current.render(scene.current, camera.current);
    requestAnimationFrame(animate);
  }, []);

  const stageResize = useCallback(() => {
    camera.current.updateProjectionMatrix();
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    camera.current.aspect = window.innerWidth / window.innerHeight;
  }, []);
  
  const scrollEvent = useCallback((e: React.WheelEvent) => {
    if (e.deltaY === -100) pageNum.current -= pageNum.current > 0 ? 1 : 0;
    else pageNum.current += pageNum.current < totalArtworks.current ? 1 : 0;
  }, []);

  useEffect(() => {
    init();
    animate();
    window.addEventListener("resize", stageResize, false);
    return () => {
      window.removeEventListener("resize", stageResize);
    }
  }, [animate, init, stageResize]);
  return <div ref={canvasRef} onWheel={scrollEvent} />
}