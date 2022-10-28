import {useCallback, useEffect, useRef} from "react";
import * as THREE from "three";

export default function Example () {
  const ref = useRef<HTMLDivElement>(null);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 5;

  const animate = useCallback(() => {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }, [camera, cube.rotation, renderer, scene]);

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