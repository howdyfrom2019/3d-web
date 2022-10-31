import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {ProjectProvider} from "../context/context";
import {prefix} from "../config/config";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ProjectProvider value={{ prefix }}>
      <Component {...pageProps} />
    </ProjectProvider>
  )
}
