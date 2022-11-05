import * as Three from "three";
import {useCallback, useEffect, useRef} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default function Boxes() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const scene = useRef<Three.Scene>(new Three.Scene());
  const camera = useRef<Three.PerspectiveCamera>(new Three.PerspectiveCamera(80, window.innerWidth /window.innerHeight, 0.1, 10000));
  const renderer = useRef<Three.WebGLRenderer>(new Three.WebGLRenderer({ antialias: true }));
  const controls = useRef<OrbitControls>(new OrbitControls(camera.current, renderer.current.domElement))

  const init = useCallback(() => {
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setClearColor(0x000000);
    canvasRef.current?.appendChild(renderer.current.domElement);
    camera.current.position.set(0, 0, 150);

    const axes = new Three.AxesHelper(150);
    const gridHelper = new Three.GridHelper(240, 20);
    scene.current.add(axes, gridHelper);

    const light = new Three.HemisphereLight(0xffffff, 0x080820, 1);
    const lightHelper = new Three.HemisphereLightHelper(light, 20);
    light.position.set(100, 100, 0);
    scene.current.add(light, lightHelper);

    for (let i = 0; i < 10; i++) {
      addBox(i);
    }
  }, []);

  const addBox = (i: number) => {
    const geometry = new Three.BoxGeometry(20, 5, 20);
    const material = new Three.MeshLambertMaterial({ color: 0xffffff });
    const box = new Three.Mesh(geometry, material);
    box.position.set(0, i * 10, 0);
    box.rotation.set(0, i, 0);
    scene.current.add(box);
  }

  const animate = useCallback(() => {
    controls.current.update();
    renderer.current.render(scene.current, camera.current);
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