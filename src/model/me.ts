'use client'

import fetcher from "@/lib/fetcher";
import useSWR from "swr";

export interface MeInterface {
  id: number;
  role: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  registrationDate: string;
}

export const useMe = (id: number) => {
  const { data, error, isLoading } = useSWR<MeInterface>('/api/auth/me/' + id.toString(), fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};