'use client'

import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { ProductInterface } from "./product";

export interface CartInterface {
  id: number;
  quantity: number;
  duration: number;
  productId: number;
  userId: number;
  product: ProductInterface;
}

export const useCart = (id: number) => {
  const { data, error, isLoading } = useSWR<CartInterface[]>(`/api/user/cart/${id.toString()}/all`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};

export const useTotal = (id: number) => {
  const { data, error, isLoading } = useSWR<{ totalCost: number }>(`/api/user/cart/${id.toString()}/total`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};