'use client'

import Link from "next/link";

export default function Advertisement() {
  return (
    <div className="relative isolate flex items-center justify-center gap-x-6 overflow-hidden bg-gray-50 sm:px-2 md:px-6 py-2">
      <div
        aria-hidden="true"
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="flex whitespace-nowrap overflow-hidden items-center gap-x-4 gap-y-2">
        <div className="whitespace-nowrap overflow-hidden">
          <p className="sm:text-xs md:text-sm leading-6 text-gray-900 animate-marquee">
            <strong className="font-semibold">Share And Care 2025</strong>
            <span className="mx-2">|</span>
            <span className="ml-2 mr-40">Join us in Denver from June 7 – 9 to see what’s coming next.</span>

            <strong className="font-semibold">Share And Care 2025</strong>
            <span className="mx-2">|</span>
            <span className="mx-2">Join us in Denver from June 7 – 9 to see what’s coming next.</span>
          </p>
        </div>
        <Link
          href="/shop"
          title="Cửa hàng"
          className="flex-none rounded-full bg-teal-600 px-3 py-1 sm:text-xs md:text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          Xem ngay <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}