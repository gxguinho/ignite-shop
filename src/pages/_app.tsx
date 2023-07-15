import { globalStyle } from "@/styles/global";
import type { AppProps } from "next/app";
import LogoSvg from "@/assets/logo.svg";
import { Container, Header } from "@/styles/pages/app";
import Image from "next/image";
import { Roboto } from "next/font/google";

globalStyle();

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container className={roboto.className}>
      <Header>
        <Image src={LogoSvg} alt="" />
      </Header>

      <Component {...pageProps} />
    </Container>
  );
}
