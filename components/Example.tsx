import {useCallback, useEffect, useRef} from "react";
import * as THREE from "three";

export default function Example () {
  const step = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.x = 0;
  camera.position.y = 1;
  camera.position.z = 5;

  const axes = new THREE.AxesHelper(10);
  const gridHelper = new THREE.GridHelper(20, 10);
  scene.add(axes);
  scene.add(gridHelper);

  const spotLight = new THREE.SpotLight(0xffffff);
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  spotLight.position.set(1, 2.5, 5.5);
  scene.add(spotLight);
  scene.add(spotLightHelper);

  const animate = useCallback(() => {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    step.current += 0.05;
    
    cube.position.y += 0.1 * Math.cos(step.current);

    renderer.render(scene, camera);
  }, [camera, cube.position, cube.rotation, renderer, scene]);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.appendChild(renderer.domElement);
    animate();
  }, [animate, renderer.domElement]);

  return (
    <>
      <div ref={ref}>
      </div>
    </>
  )
}