import * as Three from "three";
import {useCallback, useEffect, useRef, useState} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default function Gallery() {
  const [frameCount, setFrameCount] = useState(2);
  const distance = useRef<number>(100);
  const canvasRef = useRef<HTMLDivElement>(null);
  const scene = useRef<Three.Scene>(new Three.Scene());
  const camera = useRef<Three.PerspectiveCamera>(new Three.PerspectiveCamera(80, window.innerWidth /window.innerHeight, 0.1, 10000));
  const renderer = useRef<Three.WebGLRenderer>(new Three.WebGLRenderer({ antialias: true }));
  const controls = useRef<OrbitControls>(new OrbitControls(camera.current, renderer.current.domElement))

  const init = useCallback(() => {
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setClearColor(0x000000);
    canvasRef.current?.appendChild(renderer.current.domElement);
    renderer.current.shadowMap.enabled = true;
    renderer.current.shadowMap.type = Three.PCFShadowMap;

    const axes = new Three.AxesHelper(150);
    const gridHelper = new Three.GridHelper(240, 20);
    scene.current.add(axes, gridHelper);
    camera.current.position.set(0, 20, 150);

    const light = new Three.HemisphereLight(0xffffff, 0x080820, 0.8);
    light.position.set(0, 50, 50);
    scene.current.add(light);
    const galleryGroup = new Three.Group();

    {
      const wallWidth: number = frameCount * distance.current;
      const geometry = new Three.BoxGeometry(wallWidth, 100, 2);
      const material = new Three.MeshPhongMaterial({ color: 0x464946 });
      const wallMesh = new Three.Mesh(geometry, material);

      wallMesh.position.set(wallWidth / 2, 0, -1.5);
      wallMesh.receiveShadow = true;
      wallMesh.castShadow = true;
      galleryGroup.add(wallMesh);
      scene.current.add(galleryGroup);
    }
  }, []);

  const animate = useCallback(() => {
    renderer.current.render(scene.current, camera.current);
    controls.current.update();
    requestAnimationFrame(animate);
  }, []);

  const stageResize = useCallback(() => {
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    camera.current.aspect = window.innerWidth / window.innerHeight;
  }, []);

  useEffect(() => {
    init();
    animate();
    window.addEventListener("resize", stageResize, false);
    return () => {
      window.removeEventListener("resize", stageResize);
    }
  }, [animate, init, stageResize]);
  return <div ref={canvasRef} />
}