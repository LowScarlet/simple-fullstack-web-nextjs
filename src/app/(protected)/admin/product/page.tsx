/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { useProduct } from "@/model/admin/product";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { mutate } from "swr";

export default function Home() {
  const router = useRouter();
  const {
    user: authUser,
    isAuthenticated,
  } = useAuth();

  const {
    data: dataProduct,
    isLoading: loadingProduct,
  } = useProduct();

  const addProduct = async () => {
    try {
      const data = await axiosInstance.post(`/api/admin/product`, {});
      mutate((key: string) => key.startsWith('/api/admin/product'));
      router.push('/admin/product/' + data.data.id);
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/admin/product/?id=${id}`, {});
      mutate((key: string) => key.startsWith('/api/admin/product'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    }
  };

  if (!isAuthenticated || !authUser) {
    return (<>Error</>)
  }

  return (<>
    <div className="px-4 pt-4">
      <h3 className="font-medium text-xs">Hi, {authUser.fullName}</h3>
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">Sewa Alat Camping</h1>
      </div>
    </div>
    <div className="px-4 py-2">
      <Image
        width={1000}
        height={225}
        src="https://www.wallpaperflare.com/static/567/415/630/nature-photography-landscape-hiking-wallpaper-preview.jpg"
        className="shadow-md rounded-md w-full h-20 object-cover"
        alt={"Image"}
      />
    </div>
    <div className="px-4 pt-2 pb-32">
      <div className="flex justify-between">
        <h1 className="font-bold text-base">Kelola Barang</h1>
        <div>
          <button onClick={addProduct} className="btn btn-primary btn-xs">
            Tambah Barang
          </button>
        </div>
      </div>
      <div>
        {loadingProduct ? (
          <div>Loading...</div>
        ) : (
          dataProduct?.map((product) => (
            <div key={product.id} className="block shadow-md py-2">
              <div className="flex gap-2 p-2">
                <div className="flex-none">
                  <div className="avatar">
                    <div className="rounded w-12">
                      <Image width={100} height={100} src={product.icon || "/images/unknown4x4.png"} alt={product.name} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between grow">
                  <div className="grow">
                    <h2 className="text-sm">{product.name}</h2>
                    <h1 className="font-bold text-sm">Rp {product.price.toLocaleString()},00</h1>
                    <div className="flex justify-between items-end mt-4">
                      <button className="btn btn-neutral btn-xs">{product.category?.name}</button>
                      <h1 className="font-medium text-xs">Tersedia {product.stock} barang</h1>
                    </div>
                  </div>
                  <div className="space-x-2"> 
                    <button onClick={() => deleteProduct(product.id.toString())} className="z-40 btn btn-error btn-xs"><FaTrash /></button>
                    <Link href={'/admin/product/' + product.id} className="btn btn-warning btn-xs"><MdEdit /></Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </>);
}
