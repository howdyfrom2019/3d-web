import {useCallback, useEffect, useRef} from "react";
import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default function SnowMan() {
  const scene = useRef<Three.Scene>(new Three.Scene());
  const camera = useRef<Three.PerspectiveCamera>(new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000));
  const renderer = useRef<Three.WebGLRenderer>(new Three.WebGLRenderer({antialias: true, alpha: true}));
  const canvasRef = useRef<HTMLDivElement>(null);
  const snowman = useRef<Three.Object3D>(new Three.Object3D());
  
  const init = useCallback(() => {
    renderer.current.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.current.setClearColor(0xdcdcdc, 1);
    canvasRef.current?.appendChild(renderer.current.domElement);

    camera.current.position.z = 50;
    camera.current.position.x = 30;
    camera.current.position.y = 20;
    scene.current.add(camera.current);
    scene.current.add(snowman.current);

    const axes = new Three.AxesHelper(50);
    const grid = new Three.GridHelper(70, 20);
    const ambient = new Three.AmbientLight(0x999999, 1);
    scene.current.add(axes, grid, ambient);

    const geometry = new Three.IcosahedronGeometry(7, 4);
    const geomBody = new Three.IcosahedronGeometry(15, 4);
    const material = new Three.MeshPhongMaterial({ color: 0xffffff });
    const face = new Three.Mesh(geometry, material);
    const body = new Three.Mesh(geomBody, material);
    body.position.set(0, -20, 0);

    const geomNose = new Three.ConeGeometry(5, 15, 12);
    const materialNose = new Three.MeshPhongMaterial({ color: 0xFFA500 });
    const nose = new Three.Mesh(geomNose, materialNose);
    nose.position.set(0, 0, 4);
    nose.rotation.set(-4.86, 10, 0);

    const geomEye = new Three.SphereGeometry(1, 10, 10);
    const materialEye = new Three.MeshPhongMaterial({ color: 0x000000 });
    const leftEye = new Three.Mesh(geomEye, materialEye);
    const rightEye = new Three.Mesh(geomEye, materialEye);
    leftEye.position.set(-3, 4, 4);
    rightEye.position.set(3, 4, 4);

    const wholeFace = new Three.Group();
    wholeFace.add(face, nose, leftEye, rightEye, body);
    wholeFace.position.set(0, 20, 0)
    scene.current.add(wholeFace);

    const orbitControl = new OrbitControls(camera.current, renderer.current.domElement);
    orbitControl.enableDamping = true;
    orbitControl.update();

    renderer.current.setSize(window.innerWidth, window.innerHeight);
    camera.current.aspect = window.innerWidth / window.innerHeight;
    renderer.current.render(scene.current, camera.current);
    camera.current.updateProjectionMatrix();
  }, []);
  
  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    renderer.current.clear();

    renderer.current.render(scene.current, camera.current);
  }, []);
  
  useEffect(() => {
    init();
    animate();
  }, [animate, init]);

  return (
    <div ref={canvasRef} />
  )
}