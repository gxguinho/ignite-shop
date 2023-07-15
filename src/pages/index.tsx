import { HomeContainer, Product } from "@/styles/pages/home";
import Image from "next/image";

import camiseta1 from "@/assets/camisetas/Shirt/1.png";
import camiseta2 from "@/assets/camisetas/Shirt/2.png";
import camiseta3 from "@/assets/camisetas/Shirt/3.png";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { stripe } from "@/lib/stripe";
import { Stripe } from "stripe";
import { GetStaticProps } from "next";

interface HomeProps {
  products: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  }[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => (
        <Product className="keen-slider__slide" key={product.id}>
          <Image src={product.imageUrl} alt="" width={520} height={480} />

          <footer>
            <strong>{product.name}</strong>
            <span>{product.price}</span>
          </footer>
        </Product>
      ))}
    </HomeContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      price: price.unit_amount
        ? new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(price.unit_amount / 100)
        : 0,
      imageUrl: product.images[0],
    };
  });

  return {
    props: { products },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
