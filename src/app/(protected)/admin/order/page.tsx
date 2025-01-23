/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useAuth } from "@/context/AuthContext";
import { useOrder } from "@/model/admin/order";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { mutate } from "swr";
import { OrderStatus } from "@prisma/client";

export default function Home() {
  const [visibleStatusId, setVisibleStatusId] = useState<number | null>(null);

  const {
    user: authUser,
    isAuthenticated,
  } = useAuth();

  const {
    data: dataOrder,
    isLoading: loadingOrder,
  } = useOrder();

  const setStatusOrder = async (orderId: string, value: keyof typeof OrderStatus) => {
    try {
      await axiosInstance.post(`/api/admin/order/${orderId}/status/${value}`);
      mutate((key: string) => key.startsWith('/api/admin/order'));
    } catch (err: any) {
      console.error('Error setting status order:', err);
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
        src="https://www.wallpaperflare.com/static/567/415/630/nature-photography-landscape-hiking-wallpaper-preview.jpg"
        className="shadow-md rounded-md w-full h-20 object-cover"
        alt={"Image"}
      />
    </div>
    <div className="px-4 pt-2 pb-32">
      <div className="flex justify-between">
        <h1 className="font-bold text-base">Kelola Pesanan</h1>
      </div>
      <div>
        {loadingOrder ? (
          <div>Loading...</div>
        ) : (
          dataOrder?.map((order) => (
            <div key={order.id} className="shadow-md py-2">
              <div className="flex gap-2 p-2">
                <div className="flex-none">
                  <div className="avatar">
                    <div className="rounded w-12">
                      <Image width={100} height={100} src={order.product.icon || "/images/unknown4x4.png"} alt={order.product.name} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between grow">
                  <div className="grow">
                    <h2 className="text-sm">{order.product.name}</h2>
                    <h1 className="font-bold text-sm">Rp {order.price.toLocaleString()},00</h1>
                    <p className="text-xs">
                      {order.quantity}x Barang Selama {order.duration} Hari
                    </p>
                    <div className="flex justify-between items-end mt-4">
                      <button
                        className="btn btn-neutral btn-xs"
                        onClick={() => setVisibleStatusId(visibleStatusId === order.id ? null : order.id)}
                      >
                        {order.status}
                      </button>
                      <h1 className="font-medium text-xs">{order.method}</h1>
                    </div>
                    {visibleStatusId === order.id && (
                      <div className="bg-gray-100 mt-4 p-2 rounded-md">
                        <h1 className="font-bold text-sm">Ubah Status</h1>
                        <div className="space-x-2">
                          <button
                            onClick={() => setStatusOrder(order.id.toString(), OrderStatus.Completed)}
                            className="btn btn-primary btn-xs">
                            Selesai
                          </button>
                          <button
                            onClick={() => setStatusOrder(order.id.toString(), OrderStatus.In_Progress)}
                            className="btn btn-primary btn-xs">
                            Disewakan
                          </button>
                          <button

                            onClick={() => setStatusOrder(order.id.toString(), OrderStatus.Waiting_Confirmation)}
                            className="btn btn-primary btn-xs">
                            Menunggu
                          </button>
                        </div>
                      </div>
                    )}
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
