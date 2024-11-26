import Link from 'next/link'
import React from 'react'
import data from "@/data/data.json";
import Card from '@/app/ui/card';
import BackButton from '@/app/ui/back-button';
import { capitalizeFirstLetter } from '@/utils/helpers';

export default async function Page({
    params,
}: {
    params: Promise<{ category: string }>
}) {
    const name = capitalizeFirstLetter((await params).category)

    const category = data.categories.find(item => item.name === name);
    const products = data.products.filter(item => item.category === name);

    if (!category) {
        return <div>Category not found</div>;
    }

    return (
        <div className='flex flex-col w-full px-24 py-10'>
            <div className='flex items-center space-x-24'>
                <BackButton previousPathname="/" />

                <ul className="flex space-x-1 text-xl">
                    <li>
                        <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
                    </li>
                    <li>
                        {name}
                    </li>
                </ul>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-8 mt-10">
                {products.map((product, index) => {
                    return (
                        <Card key={index} product={product} />
                    )
                })}
            </div>
        </div>
    )
}