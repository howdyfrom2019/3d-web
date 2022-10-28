import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";

const ThreeJSSetting = dynamic(() => import("../components/Example"), {ssr: false});

export default function Home() {
  return (
    <>
      <div className={styles.h1}>HELLO THREEJS!!</div>
      <ThreeJSSetting/>
    </>
  )
}