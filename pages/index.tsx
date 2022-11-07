import dynamic from "next/dynamic";

const ThreeJSSetting = dynamic(() => import("../components/gallery"), {ssr: false});

export default function Home() {
  return (
    <div className={"page-wrapper"}>
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