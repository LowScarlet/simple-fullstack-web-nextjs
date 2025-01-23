'use client'

import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { CategoryInterface } from "../category";

export const useCategory = () => {
  const { data, error, isLoading } = useSWR<CategoryInterface[]>('/api/admin/category', fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};

export const useCategoryDetail = (id: number) => {
  const { data, error, isLoading } = useSWR<CategoryInterface>('/api/admin/category/' + `${id}`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};