import dynamic from "next/dynamic";

const ThreeJSSetting = dynamic(() => import("../components/Gradient"), {ssr: false});

export default function Home() {
  return (
    <div className={"page-wrapper"}>
      <header className={"header"}>Hello, Three.JS</header>
      <ThreeJSSetting />
      <style jsx>{`
        .page-wrapper {
          display: flex;
          flex-direction: column;
        }
        
        .header {
          font-size: 64px;
          color: white;
        }
      `}</style>
    </div>
  )
}