import { HomeContainer, Product } from "@/styles/pages/home";
import Image from "next/image";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { stripe } from "@/lib/stripe";
import { Stripe } from "stripe";
import { GetStaticProps } from "next";

import Link from "next/link";
import { useEffect, useState, MouseEvent } from "react";
import { ProductSkeleton } from "@/components/ProductSkeleton";
import { CartButton } from "@/components/CartButton";
import { ProductData } from "@/contexts/CartContext";
import { useCart } from "@/hooks/useCart";

export default function Home({ products }: { products: ProductData[] }) {
  const [isLoading, setIsLoading] = useState(true);

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  const { addToCart, checkIfItemAlreadyExists } = useCart();

  function handleAddToCart(
    e: MouseEvent<HTMLButtonElement>,
    product: ProductData
  ) {
    e.preventDefault();
    addToCart(product);
  }

  useEffect(() => {
    const timeOut = setTimeout(() => setIsLoading(false), 2000);

    return () => clearTimeout(timeOut);
  }, []);

  if (isLoading) {
    return (
      <HomeContainer
        className="keen-slider"
        style={{ display: "flex", gap: "2rem" }}
      >
        <ProductSkeleton className="keen-slider__slide" />
        <ProductSkeleton className="keen-slider__slide" />
        <ProductSkeleton className="keen-slider__slide" />
      </HomeContainer>
    );
  }

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => (
        <Link
          href={`/product/${product.id}`}
          key={product.id}
          passHref
          legacyBehavior
          prefetch={false}
        >
          <Product className="keen-slider__slide">
            <Image src={product.imageUrl} alt="" width={520} height={480} />

            <footer>
              <div>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </div>
              <CartButton
                size="large"
                color="green"
                disabled={checkIfItemAlreadyExists(product.id)}
                onClick={(e) => handleAddToCart(e, product)}
              />
            </footer>
          </Product>
        </Link>
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
      numberPrice: price.unit_amount ?? 0 / 100,
      defaultPriceId: price.id,
    };
  });

  return {
    props: { products },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
