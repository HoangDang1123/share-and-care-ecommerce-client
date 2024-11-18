import Image from "next/image";
import { Slider } from "./ui/home/slider";
import TopProduct from "./ui/home/top-product";
import data from "@/data/data.json";

const items = [
  {
    alt: 'Top Sales Thumb',
    src: '/assets/Thumb.png',
    list: data.products,
    title: "TOP SALES",
  },
  {
    alt: 'Best Seller Thumb',
    src: '/assets/Thumb.png',
    list: data.products,
    title: "BEST SELLER",
  },
  {
    alt: 'Latest Thumb',
    src: '/assets/Thumb.png',
    list: data.products,
    title: "LATEST",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden items-center space-y-20 mb-10">
      <Slider />

      {items.map((item, index) => (
        <div key={index} className="flex flex-col px-10">
          <Image
            alt={item.alt}
            src={item.src}
            width={1920}
            height={100}
            className="w-screen h-72 px-20"
          />
          <TopProduct list={item.list} title={item.title} />
        </div>
      ))}
    </div>
  );
}
