'use client'

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineProduct } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { TbTruckDelivery } from "react-icons/tb";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname()

  const {
    user: authUser,
  } = useAuth();

  return (
    <>
      {children}
      <div className="btm-nav mx-auto max-w-sm text-sm container">
        <button
          className={pathname === "/admin/product" ? "active" : ""}
          onClick={() => router.push("/admin/product")}
        >
          <AiOutlineProduct />
          <span className="btm-nav-label">Produk</span>
        </button>
        <button
          className={pathname === "/admin/order" ? "active" : ""}
          onClick={() => router.push("/admin/order")}
        >
          <TbTruckDelivery />
          <span className="btm-nav-label">Pesanan</span>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('id');
            window.location.reload();
          }}
        >
          <CgProfile />
          <span className="btm-nav-label">Keluar</span>
        </button>
      </div>
    </>
  );
}
