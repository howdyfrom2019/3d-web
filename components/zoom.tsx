import * as Three from "three";
import React, {useCallback, useEffect, useRef} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default function Zoom () {
  const totalArtworks = useRef(100);
  const artworksGroup = useRef(new Three.Object3D());
  const pageNum = useRef(0);
  const moveZ = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const moveX = useRef(0);
  const moveY = useRef(0);
  const progressBarRef = useRef<HTMLSpanElement>(null);
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

    boxMesh.position.set(Math.random() * 100 - 100 / 2, Math.random() * 50 - 50 / 2, i * 30);
    artworksGroup.current.add(boxMesh);
  }, []);

  const addLight = (x: number, y: number, z: number) => {
    const color = 0xffffff;
    const intensity = 0.4;
    const light = new Three.PointLight(color, intensity);
    light.castShadow = true;

    light.position.set(x, y, z);
    // const helper = new Three.PointLightHelper(light);
    // scene.current.add(helper, light);
    scene.current.add(light);
  }

  const init = useCallback(() => {
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setClearColor(0x000000);
    canvasRef.current?.appendChild(renderer.current.domElement);
    // camera.current.position.set(-50, 20, -40);
    camera.current.position.set(0, 0, -50);
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
    moveZ.current += (-pageNum.current * 30 - moveZ.current) * 0.07;
    moveX.current += (mouseX.current - moveX.current - window.innerWidth / 2) * 0.05;
    moveY.current += (mouseY.current - moveY.current - window.innerHeight / 2) * 0.05;
    artworksGroup.current.position.set(-(moveX.current / 50), moveY.current / 50, moveZ.current);

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
  
  const scrollEvent = useCallback(() => {
    // if (e.deltaY < 0) pageNum.current -= pageNum.current > 0 ? 1 : 0;
    // else pageNum.current += pageNum.current < totalArtworks.current ? 1 : 0;
    pageNum.current = Math.min(Math.ceil(window.scrollY / 100), totalArtworks.current);
    // console.log(scrollY.current, window.outerHeight, document.body.offsetHeight);
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.ceil(100 * window.scrollY / (document.body.offsetHeight - window.innerHeight))}%`;
    }
  }, []);

  useEffect(() => {
    init();
    animate();
    window.addEventListener("scroll", scrollEvent, false);
    window.addEventListener("resize", stageResize, false);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
      window.removeEventListener("resize", stageResize);
    }
  }, [animate, init, scrollEvent, stageResize]);
  return (
    <>
      <style jsx>{`
        .full-page {
          height: ${window.innerHeight + totalArtworks.current * 100 + "px"};
        }
        .progress {
          width: 100vw;
          height: 4px;
          position: fixed;
          display: flex;
          top: 0;
          left: 0;
          background: rgba(255, 255, 255, 0.4);
          z-index: 2;
        }
        
        .bar {
          height: 100%;
          border-radius: 1rem;
          background: #11e8bb;
          z-index: 3;
          transition: width 0.14s ease-out;
        }
        
        #canvas-wrapper {
          position: fixed;
          top: 0;
        }
      `}</style>
      <div className={"full-page"}>
        <div className={"progress"}>
          <span className={"bar"} ref={progressBarRef}/>
        </div>
        <div
          id={"canvas-wrapper"}
          ref={canvasRef}
          // onWheel={scrollEvent}
          onMouseMove={(e) => {
            mouseX.current = e.clientX;
            mouseY.current = e.clientY;
          }} />
      </div>
    </>
  )
}