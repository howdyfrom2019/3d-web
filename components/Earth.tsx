import * as Three from "three";
import {useCallback, useEffect, useRef} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

export default function Earth() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const scene = useRef<Three.Scene>(new Three.Scene());
  const camera = useRef<Three.PerspectiveCamera>(new Three.PerspectiveCamera(80, window.innerWidth /window.innerHeight, 0.1, 10000));
  const renderer = useRef<Three.WebGLRenderer>(new Three.WebGLRenderer({ antialias: true }));
  const controls = useRef<OrbitControls>(new OrbitControls(camera.current, renderer.current.domElement))

  const init = useCallback(() => {
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setClearColor(0x000000, 0.3);
    canvasRef.current?.appendChild(renderer.current.domElement);
    camera.current.position.set(200, 0,  0);
    renderer.current.render(scene.current, camera.current);

    const geometry = new Three.SphereGeometry(80, 12, 12);
    const material = new Three.MeshBasicMaterial({ color: 0xffffff });
    const sphere = new Three.Mesh(geometry, material);
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(1, 2.5, 5.5);
    scene.current.add(sphere, spotLight);

  }, []);

  const animate = useCallback(() => {
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
    window.addEventListener("resize", () => stageResize, false);
    return () => {
      window.removeEventListener("resize", () => stageResize);
    }
  }, [animate, init, stageResize]);
  return <div ref={canvasRef} />
}