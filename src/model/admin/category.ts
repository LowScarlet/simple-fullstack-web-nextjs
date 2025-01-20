'use client'

import fetcher from "@/lib/fetcher";
import useSWR from "swr";

export interface CategoryInterface {
  id: number;
  name: string;
  description: string;
}

export const useCategory = () => {
  const { data, error, isLoading } = useSWR<CategoryInterface[]>('/api/client/admin/category/all', fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};

export const useCategoryDetail = (id: number) => {
  const { data, error, isLoading } = useSWR<CategoryInterface>('/api/client/admin/category/detail/' + `${id}`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};