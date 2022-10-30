import {useCallback, useEffect, useRef} from "react";
import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default function Gradient() {
  const scene = useRef<Three.Scene>(new Three.Scene());
  const camera = useRef<Three.PerspectiveCamera>(new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000));
  const renderer = useRef<Three.WebGLRenderer>(new Three.WebGLRenderer({antialias: true, alpha: true}));
  const canvasRef = useRef<HTMLDivElement>(null);
  const circle = useRef<Three.Object3D>(new Three.Object3D());
  const brace = useRef<Three.Object3D>(new Three.Object3D());
  const particle = useRef<Three.Object3D>(new Three.Object3D());

  const init = useCallback(() => {
    renderer.current.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.autoClear = false;
    renderer.current.setClearColor(0x000000, 0.0);
    canvasRef.current?.appendChild(renderer.current?.domElement);

    camera.current.position.z = 400;
    scene.current.add(camera.current);

    scene.current.add(circle.current);
    scene.current.add(brace.current);
    scene.current.add(particle.current);

    const initialGeometry = new Three.TetrahedronGeometry(2, 0);
    const geometry = new Three.IcosahedronGeometry(7, 1);
    const geometry2 = new Three.IcosahedronGeometry(15, 1);

    const material = new Three.MeshPhongMaterial({color: 0xffffff, flatShading: true});

    for (let i = 0; i < 1000; i++) {
      const mesh = new Three.Mesh(initialGeometry, material);
      mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      mesh.position.multiplyScalar(90 + (Math.random() * 700));
      mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
      particle.current.add(mesh);
    }

    const material2 = new Three.MeshPhongMaterial({color: 0xffffff, flatShading: true});
    const material3 = new Three.MeshPhongMaterial({color: 0xffffff, wireframe: true, side: Three.DoubleSide});
    const planet = new Three.Mesh(geometry, material2);
    const planet2 = new Three.Mesh(geometry2, material3);
    const ambient = new Three.AmbientLight(0x999999, 0.2);
    const lights: Three.DirectionalLight[] = [];

    planet.scale.x = planet.scale.y = planet.scale.z = 16;
    planet2.scale.x = planet2.scale.y = planet2.scale.z = 10;
    circle.current.add(planet);
    brace.current.add(planet2);
    scene.current.add(ambient);

    lights[0] = new Three.DirectionalLight(0xffffff, 1);

    lights[0].position.set(1, 0, 0);
    lights[1] = new Three.DirectionalLight(0x11E8BB, 1);
    lights[1].position.set(0.75, 1, 0.5);
    lights[2] = new Three.DirectionalLight(0x8200C9, 1);
    lights[2].position.set(-0.75, -1, 0.5);

    lights.forEach(light => scene.current.add(light));

    const controls = new OrbitControls(camera.current, renderer.current.domElement);
    controls.enableDamping = true;
    controls.update();
  }, []);

  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    if (particle.current && circle.current && brace.current && renderer.current && scene.current && camera.current) {
      particle.current.rotation.x += 0.0000;
      particle.current.rotation.y -= 0.0040;
      circle.current.rotation.x -= 0.0020;
      circle.current.rotation.y -= 0.0030;
      brace.current.rotation.x -= 0.0010;
      brace.current.rotation.y += 0.0020;
      renderer.current.clear();

      renderer.current.render(scene.current, camera.current);
    }

  }, []);

  const stageResize = useCallback(() => {
    if (!camera.current) return;
    if (!renderer.current) return;

    renderer.current.setSize(window.innerWidth, window.innerHeight);
    camera.current.aspect = window.innerWidth / window.innerHeight;
    camera.current.updateProjectionMatrix();
  }, []);

  useEffect(() => {
    init();
    animate();
    window.addEventListener("resize", stageResize, false);

    return () => {
      return window.removeEventListener("resize", stageResize);
    }
  }, [animate, init, stageResize]);

  return (
    <div className="full-page" ref={canvasRef}>
      {/*<style jsx>{`*/}
      {/*  */}
      {/*`}</style>*/}
    </div>
  )
}