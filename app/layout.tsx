import type { Metadata } from "next";
import "./globals.css";
import { lato } from '@/app/ui/fonts';
import Banner from "./ui/banner";
import Header from "./ui/header";
import Footer from "./ui/footer";
import ScrollToTopButton from "./ui/scroll-to-top";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { AppProvider } from "./context/AppContext";
import Chat from "./ui/chat";
import Navbar from "./ui/navbar";
import ClientWrapper from "./ui/client-wrapper";

export const metadata: Metadata = {
  title:
    'Cửa hàng ShareAndCare - Thời Trang Cao Cấp TP.HCM | Quần Áo Xu Hướng',
  description:
    'Website bán quần áo Share And Care do sinh viên Đỗ Anh Khoa, Đào Hoàng Đăng, Phan Thị Ngọc Mai (HCMUTE) thực hiện. Khám phá bộ sưu tập thời trang trẻ trung, giá sinh viên tại TP.HCM. Mua sắm áo thun, váy, quần jeans chất lượng cao với phong cách hiện đại.',
  publisher: 'Cửa hàng ShareAndCare',
  creator: 'Cửa hàng ShareAndCare',
  keywords: [
    'share and care',
    'thời trang share and care',
    'quần áo thời trang tphcm',
    'thời trang sinh viên',
    'thời trang nam tphcm',
    'thời trang nữ tphcm',
    'quần jeans giá rẻ',
    'váy đẹp tphcm',
    'áo thun phong cách',
    'thời trang hcmute',
  ],
  authors: [
    {
      name: 'Cửa hàng ShareAndCare',
      url: 'https://share-and-care-client.vercel.app',
    },
  ],
  openGraph: {
    title: 'Cửa hàng ShareAndCare - Thời Trang Cao Cấp TP.HCM ',
    description:
      'Khám phá thời trang Share & Care tại TP.HCM, đồ án tốt nghiệp của Đỗ Anh Khoa, Đào Hoàng Đăng, Phan Thị Ngọc Mai (HCMUTE). Mua quần áo trẻ trung, giá sinh viên.',
    url: 'https://share-and-care-client.vercel.app',
    siteName: 'Cửa hàng ShareAndCare',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: 'https://share-and-care-client.vercel.app/assets/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Bộ sưu tập thời trang Share & Care',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ShareAndCareVN',
    title: 'Share & Care - Thời Trang Cao Cấp TP.HCM',
    description:
      'Cửa hàng ShareAndCare - Đồ án tốt nghiệp của Đỗ Anh Khoa, Đào Hoàng Đăng, Phan Thị Ngọc Mai (HCMUTE). Mua quần áo chất lượng, giá sinh viên!',
    images: 'https://share-and-care-client.vercel.app/assets/favicon.png',
  },
  // schema: {
  //   '@context': 'https://schema.org',
  //   '@type': 'WebSite',
  //   name: 'Share & Care',
  //   url: 'https://share-and-care-client.vercel.app',
  //   potentialAction: {
  //     '@type': 'SearchAction',
  //     target:
  //       'https://share-and-care-client.vercel.app/shop?search={search_term_string}',
  //     'query-input': 'required name=search_term_string',
  //   },
  //   hasPart: [
  //     {
  //       '@type': 'WebPage',
  //       name: 'Trang Chủ',
  //       url: 'https://share-and-care-client.vercel.app',
  //       description:
  //         'Cửa hàng ShareAndCare - Thời trang cao cấp TP.HCM, đồ án tốt nghiệp của sinh viên HCMUTE.',
  //     },
  //     {
  //       '@type': 'WebPage',
  //       name: 'Sản Phẩm',
  //       url: 'https://share-and-care-client.vercel.app/shop',
  //       description:
  //         'Khám phá áo thun, váy, quần jeans trẻ trung từ Share & Care.',
  //     },
  //     {
  //       '@type': 'WebPage',
  //       name: 'Blog',
  //       url: 'https://share-and-care-client.vercel.app/blog',
  //       description: 'Mẹo phối đồ, xu hướng thời trang từ Share & Care.',
  //     },
  //     {
  //       '@type': 'Organization',
  //       name: 'Share & Care',
  //       url: 'https://share-and-care-client.vercel.app',
  //       logo: 'https://share-and-care-client.vercel.app/assets/logo.png',
  //       address: {
  //         '@type': 'PostalAddress',
  //         streetAddress: 'HCMUTE, Quận 9',
  //         addressLocality: 'TP.HCM',
  //         addressCountry: 'VN',
  //       },
  //       founder: [
  //         { '@type': 'Person', name: 'Đỗ Anh Khoa' },
  //         { '@type': 'Person', name: 'Đào Hoàng Đăng' },
  //         { '@type': 'Person', name: 'Phan Thị Ngọc Mai' },
  //       ],
  //     },
  //   ],
  // },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://share-and-care-client.vercel.app',
    languages: {
      'vi-VN': 'https://share-and-care-client.vercel.app/vi',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <html lang="en">
        <body className={`${lato.className} antialiased`}>
          <main>
            <div className={`${lato.className} antialiased fixed w-screen top-0 z-10 flex flex-col`}>
              <ToastContainer />
              <Banner />
              <Navbar />
              <Header />
            </div>

            <ClientWrapper>
              {children}
            </ClientWrapper>

            <div className={`${lato.className} antialiased bottom-0 z-10 flex flex-col bg-black`}>
              <Footer />
            </div>

            <ScrollToTopButton />

            <Chat />
          </main>
        </body>
      </html>
    </AppProvider>
  );
}