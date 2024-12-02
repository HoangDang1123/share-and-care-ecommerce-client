'use client'

// import Image from "next/image";
import { Slider } from "./ui/home/slider";
import TopProduct from "./ui/home/top-product";
import { useEffect, useRef, useState } from "react";
import { CategoryDataResponse } from "@/interface/category";
import { getAllCategories } from "./api/category";
import { useAuth } from "./context/AuthContext";
import { useSearchParams } from "next/navigation";
import { getAccessToken } from "./api/token";
import { toast } from "react-toastify";

export default function Home() {
  const [categories, setCategories] = useState<Array<CategoryDataResponse>>([]);
  const searchParams = useSearchParams();
  const { isLogin, setIsLogin } = useAuth();
  const hasFetched = useRef(false);

  const userId = searchParams.get('userId');
  const refreshToken = searchParams.get('refreshToken');

  useEffect(() => {
    if (!isLogin && userId && refreshToken) {
      hasFetched.current = true;
      const fetchProducts = async () => {
        try {
          toast.success("Login successful.");
          const response = await getAccessToken(userId, refreshToken);

          localStorage.setItem('accessToken', response.tokens.accessToken);
          localStorage.setItem('refreshToken', response.tokens.refreshToken);
          localStorage.setItem('userId', userId);

          setIsLogin(true);
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      }

      fetchProducts();
    }
  }, [isLogin, userId, refreshToken, setIsLogin]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [setCategories]);

  return (
    <div className="flex flex-col overflow-hidden items-center space-y-20 mb-10">
      <Slider />

      {categories.map((category, index) => (
        <div key={index} className="flex flex-col px-10">
          {/* <Image
            alt={item.alt}
            src={item.src}
            width={1920}
            height={100}
            className="w-screen h-72 px-20"
          /> */}
          <TopProduct category={category} />
        </div>
      ))}
    </div>
  );
}
