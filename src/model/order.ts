'use client'

import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { ProductInterface } from "./product";

export interface OrderInterface {
  id: number;
  quantity: number;
  duration: number;
  price: number;
  method: string;
  codLocation: string;
  status: string;
  startAt: string;
  productId: number;
  userId: number;
  product: ProductInterface;
}

export const useOrder = ({ userId, filter }: { userId: string | null, filter: string | null }) => {
  const url = filter ? `/api/user/order/${userId}/${filter}` : `/api/user/order/${userId}/all`;
  const { data, error, isLoading } = useSWR<OrderInterface[]>(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};