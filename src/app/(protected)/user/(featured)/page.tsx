'use client'

import { useAuth } from "@/context/AuthContext";
import { useCategory } from "@/model/category";
import { ProductInterface, useProduct } from "@/model/product";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";

const Products = ({ dataProduct, isLoading }: { dataProduct?: ProductInterface[], isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center my-32">
        <span className="loading loading-lg loading-spinner"></span>
      </div>
    )
  }
  if (!dataProduct || dataProduct.length <= 0) {
    return (
      <div className="my-32 text-center">
        Produk Tidak Ditemukan!
      </div>
    )
  }
  return (
    <div className="gap-4 grid grid-cols-2 py-2">
      {
        dataProduct?.map((item, index) => (
          <Link href={`/user/product/${item.id}`} key={index} className="bg-base-100 shadow-md rounded-md overflow-hidden">
            <figure>
              <Image
                width={500}
                height={300}
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
            </figure>
            <div className="p-2">
              <h2 className="text-xs">
                {item.name}
              </h2>
              <h4 className="mt-2 font-bold text-xs">
                {item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </h4>
            </div>
          </Link>
        ))
      }
    </div>
  )
}

export default function Home() {
  const [filterCategory, setFilterCategory] = useState<number | null>(null)

  const {
    user: authUser,
    isAuthenticated,
  } = useAuth();

  const {
    data: dataProduct,
    isLoading: loadingProduct
  } = useProduct({ categoryId: filterCategory });

  const {
    data: dataCategory,
  } = useCategory();

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(event.target.value ? parseInt(event.target.value) : null);
  };

  if (!isAuthenticated || !authUser) {
    return (<>Error</>)
  }

  return (<>
    <div className="px-4 pt-4">
      <h3 className="font-medium text-xs">Hi, {authUser.fullName}</h3>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">Sewa Alat Camping</h1>
        <div className="flex justify-end items-center text-xl">
          <Link href={"/user/cart"}>
            <MdOutlineShoppingCart />
          </Link>
        </div>
      </div>
    </div>
    <div className="px-4 py-2">
      <Image
        width={1000}
        height={225}
        src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
        className="shadow-md rounded-md w-full"
        alt={"Image"}
      />
    </div>
    <div className="px-4 py-2">
      <div className="flex justify-between">
        <h1 className="font-bold text-base">Katalog</h1>
        <div className="flex justify-end items-center text-base">
          <select
            className="w-full select-bordered select-xs select"
            value={filterCategory || ''}
            onChange={handleCategoryChange}
          >
            <option value="">Semua</option>
            {
              dataCategory?.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))
            }
          </select>
        </div>
      </div>
      <Products dataProduct={dataProduct} isLoading={loadingProduct} />
    </div>
  </>);
}
