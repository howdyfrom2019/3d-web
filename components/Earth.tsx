import * as Three from "three";
import {useCallback, useEffect, useRef} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import EarthImage from "../assets/Albedo.jpg";
import SpaceImage from "../assets/universe.jpg";
import Moon from "../assets/moon.jpg";
import Cloud from "../assets/Clouds.png";

export default function Earth() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const scene = useRef<Three.Scene>(new Three.Scene());
  const camera = useRef<Three.PerspectiveCamera>(new Three.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 10000));
  const renderer = useRef<Three.WebGLRenderer>(new Three.WebGLRenderer({antialias: true}));
  const controls = useRef<OrbitControls>(new OrbitControls(camera.current, renderer.current.domElement));
  const earth = useRef<Three.Object3D>(new Three.Object3D());
  const moon = useRef<Three.Object3D>(new Three.Object3D());
  const time = useRef<number>(0);
  const distance = useRef<number>(120);

  const init = useCallback(() => {
    renderer.current.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.autoClear = false;
    canvasRef.current?.appendChild(renderer.current.domElement);
    camera.current.position.set(300, 0, 0);
    controls.current.enableDamping = true;
    controls.current.minDistance = 200;
    controls.current.maxDistance = 500;
    controls.current.autoRotate = true;

    scene.current.add(earth.current);

    {
      const space = new Three.TextureLoader().load(SpaceImage.src);
      const material = new Three.MeshBasicMaterial({map: space, side: Three.BackSide});
      const geometry = new Three.SphereGeometry(400, 32, 32);
      const universe = new Three.Mesh(geometry, material);
      scene.current.add(universe);
    }

    {
      const earthLoader = new Three.TextureLoader().load(EarthImage.src);
      const geometry = new Three.SphereGeometry(80, 32, 32);
      const material = new Three.MeshPhongMaterial({map: earthLoader});
      const planet = new Three.Mesh(geometry, material);
      earth.current.rotation.x = 0.3;
      earth.current.add(planet);
    }

    {
      const cloudLoader = new Three.TextureLoader().load(Cloud.src);
      const material = new Three.MeshPhongMaterial({
        map: cloudLoader,
        transparent: true,
        opacity: 0.4
      });
      const geometry = new Three.SphereGeometry(82, 32, 32);
      const cloud = new Three.Mesh(geometry, material);
      earth.current.add(cloud);
    }

    {
      const moonLoader = new Three.TextureLoader().load(Moon.src);
      const geometry = new Three.SphereGeometry(6, 32, 32);
      const material = new Three.MeshPhongMaterial({map: moonLoader});
      const smallPlanet = new Three.Mesh(geometry, material);
      smallPlanet.position.set(120, 0, 80);
      moon.current.add(smallPlanet);
      earth.current.add(moon.current);
    }

    const light = new Three.HemisphereLight(0xffffff, 0x080820, 1.5);
    light.position.set(100, 100, 0);
    scene.current.add(light);
    const helper = new Three.HemisphereLightHelper(light, 15);
    scene.current.add(helper);

  }, []);

  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    earth.current.rotation.y += 0.0005;
    moon.current.rotation.y += 0.01;
    time.current += 0.001;
    // moon.current.position.x = Math.sin(time.current) * distance.current;
    // moon.current.position.z = Math.cos(time.current) * distance.current;

    camera.current.lookAt(scene.current.position);
    renderer.current.clear();
    renderer.current.render(scene.current, camera.current);
  }, []);

  const stageResize = useCallback(() => {
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    camera.current.aspect = window.innerWidth / window.innerHeight;
    camera.current.updateProjectionMatrix();
  }, []);

  useEffect(() => {
    init();
    animate();
    window.addEventListener("resize", stageResize, false);
    return () => {
      window.removeEventListener("resize", stageResize);
    }
  }, [animate, init, stageResize]);
  return <div ref={canvasRef}/>
}