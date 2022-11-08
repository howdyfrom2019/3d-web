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
  const galleryGroup = useRef<Three.Group>(new Three.Group());

  const addFrame = useCallback((i: number) => {
    const imageMap = new Three.TextureLoader().load(`https://source.unsplash.com/collection/${i}`);
    const geometry = new Three.BoxGeometry(64, 36, 1);
    const material = new Three.MeshPhongMaterial({ map: imageMap });
    const boxMesh = new Three.Mesh(geometry, material);
    boxMesh.castShadow = true;
    boxMesh.position.set(i * distance.current, 0, 0);
    galleryGroup.current.add(boxMesh);

    //조명
    const spotLight = new Three.SpotLight(0xffffff, 1.6);
    const spotLightHelper = new Three.SpotLightHelper(spotLight);
    spotLight.position.set(i * distance.current, 30, 30);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.1;
    spotLight.decay = 1;
    spotLight.distance = 60;
    spotLight.target = boxMesh;
    spotLight.castShadow = true;
    galleryGroup.current.add(spotLight);
    scene.current.add(spotLightHelper);

  }, []);
  
  const init = useCallback(() => {
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setClearColor(0x000000);
    canvasRef.current?.appendChild(renderer.current.domElement);
    renderer.current.shadowMap.enabled = true;
    renderer.current.shadowMap.type = Three.PCFShadowMap;

    const axes = new Three.AxesHelper(150);
    const gridHelper = new Three.GridHelper(240, 20);
    scene.current.add(axes, gridHelper);
    camera.current.position.set(0, 0, 50);

    const light = new Three.HemisphereLight(0xffffff, 0x080820, 0.5);
    light.position.set(0, 50, 50);
    scene.current.add(light);

    {
      const wallWidth: number = frameCount * distance.current + distance.current;
      const geometry = new Three.BoxGeometry(wallWidth, 100, 2);
      const material = new Three.MeshPhongMaterial({ color: 0x333333 });
      const wallMesh = new Three.Mesh(geometry, material);

      wallMesh.position.set(wallWidth / 2 - distance.current, 0, -1.5);
      wallMesh.receiveShadow = true;
      wallMesh.castShadow = true;
      galleryGroup.current.add(wallMesh);
      scene.current.add(galleryGroup.current);
    }
    
    for (let i = 0; i < frameCount; i++) {
      addFrame(i);
    }
  }, [addFrame, frameCount]);

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