import LogoSvg from "@/assets/logo.svg";
import CartIcon from "@/assets/cart.svg";
import { HeaderContainer } from "./styles";
import Image from "next/image";
import { Cart } from "../Cart";
import { useRouter } from "next/router";
import Link from "next/link";

export function Header() {
  const { pathname } = useRouter();

  const showCartButton = pathname !== "/success";

  return (
    <HeaderContainer>
      <Link href="/" passHref legacyBehavior>
        <a>
          <Image src={LogoSvg} alt="" />
        </a>
      </Link>

      {showCartButton && <Cart />}
    </HeaderContainer>
  );
}
