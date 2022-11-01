import * as Three from "three";
import {useCallback, useEffect, useRef} from "react";
import Background from "../assets/background.jpg";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default function ThreeDimension() {
  const scene = useRef<Three.Scene>(new Three.Scene());
  const camera = useRef<Three.PerspectiveCamera>(new Three.PerspectiveCamera(80, window.innerWidth /window.innerHeight, 0.1, 10000));
  const renderer = useRef<Three.WebGLRenderer>(new Three.WebGLRenderer({ antialias: true }));
  const canvasRef = useRef<HTMLDivElement>(null);
  const controls = useRef<OrbitControls>(new OrbitControls(camera.current, renderer.current.domElement))
;
  const init = useCallback(() => {
    camera.current.position.set(400, 150, 0);
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setClearColor(0x0000000);
    canvasRef.current?.appendChild(renderer.current.domElement);

    const imageLoader = new Three.TextureLoader();
    imageLoader.load(Background.src, (data) => {
      const material = new Three.MeshBasicMaterial({
        map: data,
        side: Three.BackSide
      });
      const geometry = new Three.SphereGeometry(400, 32, 32);
      const roomMesh = new Three.Mesh(geometry, material);
      scene.current.add(roomMesh);
    })
  }, []);

  const updateCamera = useCallback(() => {
    camera.current.lookAt(scene.current.position);
    camera.current.updateProjectionMatrix();

    controls.current.update();
    renderer.current.render(scene.current, camera.current);
    requestAnimationFrame(updateCamera);
  }, []);

  const stageResize = useCallback(() => {
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    camera.current.aspect = window.innerWidth / window.innerHeight;
  }, []);

  useEffect(() => {
    init();
    updateCamera();
    document.addEventListener("resize", () => stageResize, false);
    
    return () => {
      document.removeEventListener("resize", () => stageResize);
    }
  }, [init, stageResize, updateCamera]);
  
  return <div ref={canvasRef} />
}