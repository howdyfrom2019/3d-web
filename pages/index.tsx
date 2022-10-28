import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";

const ThreeJSSetting = dynamic(() => import("../components/Gradient"), {ssr: false});

export default function Home() {
  return (
    <>
      <ThreeJSSetting/>
    </>
  )
}