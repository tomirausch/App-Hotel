import "@/styles/globals.css";
import LayoutHeader from "../components/LayoutHeader"

export default function App({ Component, pageProps }) {

  return(
    <LayoutHeader>
      <Component {...pageProps} />
    </LayoutHeader>
  );
}