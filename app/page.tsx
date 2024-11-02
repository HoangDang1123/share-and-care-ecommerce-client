import Image from "next/image";
import { ImageSlider } from "./ui/home/slider";
import TopProduct from "./ui/home/top-product";
import TopProduct1 from "./ui/home/top-product-v1";

const topSales = [
  { image: "/assets/Product.png", name: "Example Product", price: "99.000đ", rating: 5, sold: 0, discount: "-100%" },
  { image: "/assets/Product.png", name: "Example Product", price: "99.000đ", rating: 5, sold: 0, discount: "-100%" },
  { image: "/assets/Product.png", name: "Example Product", price: "99.000đ", rating: 5, sold: 0, discount: "-100%" },
  { image: "/assets/Product.png", name: "Example Product", price: "99.000đ", rating: 5, sold: 0, discount: "-100%" },
  { image: "/assets/Product.png", name: "Example Product", price: "99.000đ", rating: 5, sold: 0, discount: "-100%" },
]

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-16">
      <ImageSlider />

      <div className="flex flex-col px-10">
        <div className="px-10">
          <Image
            alt="Top Sales Thumb"
            src="/assets/Thumb.png"
            width={1920}
            height={100}
            className="w-screen h-72"
          />
        </div>

        {/* <TopProduct1 list={topSales} /> */}
        <TopProduct list={topSales} />
      </div>
    </div>
  );
}
