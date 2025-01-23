'use client'

import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { ProductInterface } from "../product";

export const useProduct = () => {
  const { data, error, isLoading } = useSWR<ProductInterface[]>('/api/admin/product/', fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};

export const useProductDetail = (id: number) => {
  const { data, error, isLoading } = useSWR<ProductInterface>('/api/admin/product/' + `${id}`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};