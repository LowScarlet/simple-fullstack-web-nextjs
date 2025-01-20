/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useAuth } from "@/context/AuthContext";
import { useProductDetail } from "@/model/product";
import Image from "next/image";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { use, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

export default function Product_Detail({ params }: { params: Promise<{ productId: number }> }) {
  const router = useRouter();

  const { productId } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const userId = localStorage.getItem('id') || '0';

  const { user: authUser, isAuthenticated } = useAuth();
  const { data: dataProduct, isLoading: loadingProductDetail } = useProductDetail(productId);

  if (loadingProductDetail) {
    return (
      <div className="flex justify-center items-center bg-base-100 min-h-svh">
        <div className="flex flex-col items-center gap-4">
          <span className="text-primary loading loading-lg loading-spinner"></span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !authUser || !dataProduct) {
    return <>Error</>;
  }

  const addToCart = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      await axiosInstance.post(`/api/user/cart/${userId}/add_cart/${productId}`);
      router.push('/user/cart');
    } catch (err: any) {
      setIsError(true);
      console.error('Error adding to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between px-4 pt-4 pb-2 text-xl">
        <Link href={"/user"} className="btn btn-circle btn-ghost btn-sm">
          <FaArrowLeft />
        </Link>
        <Link href={""} className="btn btn-circle btn-ghost btn-sm">
          <BsThreeDotsVertical />
        </Link>
      </div>
      <div className="space-y-2 min-h-svh">
        <div className="shadow-md py-2">
          <Image
            width={1000}
            height={225}
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            className="w-full"
            alt={"Image"}
          />
          <div className="p-2">
            <h1 className="font-bold text-2xl">{dataProduct.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</h1>
            <h2 className="pt-2 text-sm">{dataProduct.name}</h2>
          </div>
        </div>
        <div className="shadow-md p-2">
          <h1 className="font-bold text-base">Detail Produk</h1>
          <div className="px-2 text-sm">
            <div className="flex py-2 border-b border-base-content">
              <div className="min-w-32">Kategori</div>
              <div className="w-full font-medium">{dataProduct.category.name || 'Lainnya...'}</div>
            </div>
            <div className="flex py-2 border-b border-base-content">
              <div className="min-w-32">Tersedia</div>
              <div className="w-full font-medium">{dataProduct.stock} Barang</div>
            </div>
          </div>
        </div>
        <div className="shadow-md p-2">
          <h1 className="font-bold text-base">Deskripsi Produk</h1>
          <p className="px-2 text-xs">{dataProduct.description || 'Deskripsi Tidak Tersedia.'}</p>
        </div>
      </div>
      <div className="bottom-0 sticky flex gap-2 bg-white p-2">
        <Link href={""} className="shadow-md btn btn-outline btn-square">
          <FaWhatsapp />
        </Link>
        <button
          onClick={addToCart}
          disabled={isLoading}
          className={`shadow-md btn grow ${isError ? 'btn-error' : 'btn-neutral'}`}
        >
          <MdOutlineShoppingCart />
          {isLoading ? 'Loading...' : isError ? 'Gagal Menambahkan' : 'Keranjang'}
        </button>
      </div>
    </>
  );
}
