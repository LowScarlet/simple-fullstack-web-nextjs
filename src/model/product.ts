'use client'

import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { CategoryInterface } from "./category";

export interface ProductInterface {
  id: number;
  icon: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  registrationDate: string;
  categoryId: number;
  category: CategoryInterface;
}

export const useProduct = ({ categoryId }: { categoryId: number | null }) => {
  const url = categoryId ? `/api/user/product/byCategory/${categoryId}` : '/api/user/product/all';
  const { data, error, isLoading } = useSWR<ProductInterface[]>(url, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};

export const useProductDetail = (id: number) => {
  const { data, error, isLoading } = useSWR<ProductInterface>('/api/user/product/detail/' + `${id}`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};