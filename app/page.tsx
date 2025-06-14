'use client'

import { Slider } from "./ui/home/slider";
import TopProduct from "./ui/home/top-product";
import { useEffect, useRef, useState } from "react";
import { getAllCategories } from "./api/category";
import { useAuth } from "./context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getAccessToken } from "./api/token";
import { toast } from "react-toastify";
import { Suspense } from 'react';
import { CategoryResponse } from "@/interface/category";
import { reconnectSocket } from "@/utils/socket";
import { useSocket } from "./context/SocketContext";

export default function Home() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLogin, setIsLogin } = useAuth();
  const { setSocket } = useSocket();
  const hasFetched = useRef(false);
  const hasLoggedIn = useRef(false);

  const userId = searchParams.get('userId');
  const refreshToken = searchParams.get('refreshToken');

  useEffect(() => {
    const storedIsLogin = localStorage.getItem('isLogin');
    if (storedIsLogin === 'true') {
      setIsLogin(true);
      hasLoggedIn.current = true;
    }
  }, [setIsLogin]);

  useEffect(() => {
    if (!isLogin && userId && refreshToken && !hasFetched.current && !hasLoggedIn.current) {
      hasFetched.current = true;
      const fetchToken = async () => {
        try {
          toast.success("Đăng nhập thành công.");
          const response = await getAccessToken(userId, refreshToken);

          setIsLogin(true);
          hasLoggedIn.current = true;

          const currentTime = new Date().getTime();

          if (typeof window !== "undefined") {
            localStorage.setItem('accessToken', response.tokens.accessToken);
            localStorage.setItem('refreshToken', response.tokens.refreshToken);
            localStorage.setItem('userId', userId);
            localStorage.setItem('tokenTimestamp', currentTime.toString());
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('avatarUrl', response.user.avatar);
            localStorage.setItem('email', response.user.email);
            localStorage.setItem('name', response.user.name);

            const socket = reconnectSocket({
              token: localStorage.getItem('accessToken') || '',
              deviceToken: localStorage.getItem('deviceToken') || '',
              role: 'user',
            });

            setSocket(socket);

            socket.on('connect', () => {
              console.log('🔄 Reconnected with user');
            });
          }

          router.push('/');
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      }

      fetchToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, userId, refreshToken]);

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
    <div className="flex flex-col overflow-hidden items-center sm:space-y-10 md:space-y-20 mb-10">
      <Slider />

      <Suspense fallback={<div>Loading categories...</div>}>
        {categories.map((category, index) => (
          <div key={index} className="flex flex-col px-10">
            <TopProduct category={category} />
          </div>
        ))}
      </Suspense>
    </div>
  );
}