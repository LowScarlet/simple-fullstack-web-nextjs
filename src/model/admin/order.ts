'use client'

import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { OrderInterface } from "../order";

export const useOrder = () => {
  const { data, error, isLoading } = useSWR<OrderInterface[]>('/api/admin/order/', fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};

export const useOrderDetail = (id: number) => {
  const { data, error, isLoading } = useSWR<OrderInterface>('/api/admin/order/' + `${id}`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};