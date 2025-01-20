/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { useOrder } from "@/model/order";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { mutate } from "swr";

export default function Order() {
  const [filter, setFilter] = useState<string>('all');
  
  const userId = localStorage.getItem('id');

  const {
    user: authUser,
    isAuthenticated,
  } = useAuth();

  const {
    data: dataOrder,
  } = useOrder({ userId, filter });

  const deleteItem = async (orderId: number) => {
    try {
      await axiosInstance.post(`/api/user/order/${userId}/delete_order/${orderId}`);
      mutate((key: string) => key.startsWith('/api/user/order'));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
    }
  };

  if (!isAuthenticated || !authUser) {
    return (<>Error</>)
  }

  return (<>
    <div className="flex gap-2 px-12 py-4">
      <button onClick={() => setFilter('all')} className={(filter != 'all' ? 'btn-outline' : '') + " btn btn-neutral btn-sm grow"}>Semua</button>
      <button onClick={() => setFilter('completed')} className={(filter != 'completed' ? 'btn-outline' : '') + " btn btn-neutral btn-sm grow"}>Selesai</button>
    </div>

    <div className="z-0 space-y-2 min-h-svh">
      {
        dataOrder?.map((item, index) => (
          <div className="shadow-md py-2" key={index}>
            <div className="flex gap-2 p-2">
              <div className="flex-none">
                <div className="avatar">
                  <div className="rounded w-12">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between grow">
                <div className="grow">
                  <h2 className="text-sm">{item.product.name}</h2>
                  <h1 className="font-bold text-sm">{item.product.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })} x{item.quantity}, Durasi {item.duration} Hari</h1>
                  {
                    item.codLocation && <p className="text-xs">Lokasi: {item.codLocation}</p>
                  }
                  <div className="flex justify-between items-end mt-4">
                    <button className="btn btn-neutral btn-xs">{item.status}</button>
                    <h1 className="font-medium text-xs">Total <span>{item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span></h1>
                  </div>
                </div>
                <div>
                  <button onClick={() => deleteItem(item.id)} className="text-xl btn btn-circle btn-ghost btn-sm">
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  </>);
}
