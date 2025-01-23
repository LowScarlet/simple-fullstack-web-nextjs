'use client'

import { useAuth } from "@/context/AuthContext";
import { useProductDetail } from "@/model/product";
import Image from "next/image";
import Link from "next/link";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { use, useState, useEffect } from "react";
import { useCategory } from "@/model/admin/category";
import axiosInstance from "@/lib/axiosInstance";
import { mutate } from "swr";
import { useRouter } from "next/navigation";

export default function Product_Detail({ params }: { params: Promise<{ productId: string }> }) {
  const router = useRouter();
  const { user: authUser, isAuthenticated } = useAuth();
  const { productId } = use(params);

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0
  });

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const {
    data: dataProduct,
    isLoading: loadingProduct,
  } = useProductDetail(parseInt(productId));

  const {
    data: categories,
    isLoading: loadingCategories,
  } = useCategory(); // Add categories hook

  useEffect(() => {
    if (dataProduct) {
      setFormData({
        name: dataProduct.name || '',
        description: dataProduct.description || '',
        price: dataProduct.price || 0,
        stock: dataProduct.stock || 0,
        icon: dataProduct.icon || '',
        categoryId: dataProduct.categoryId || 0
      });
    }
  }, [dataProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'categoryId'
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', productId);

      try {
        const response = await axiosInstance.post('/api/admin/product/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setFormData(prev => ({
            ...prev,
            icon: response.data.filepath
          }));
          mutate((key: string) => key.startsWith('/api/admin/product'));
        }
      } catch (error) {
        alert('Error uploading image: ' + (error as Error).message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.patch(`/api/admin/product/`, {
        ...formData,
        id: parseInt(productId),
        categoryId: isNewCategory ? undefined : formData.categoryId,
        newCategory
      });

      if (response.status === 200) {
        mutate((key: string) => key.startsWith('/api/admin/product'));
        router.push('/admin/product');
      }
    } catch (error) {
      alert('Error updating product: ' + (error as Error).message);
    }
  };

  if (!isAuthenticated || !authUser) {
    return <div>Authentication required</div>;
  }

  if (loadingProduct || loadingCategories) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center px-4 pt-4 pb-2 text-xl">
        <Link href={"/admin/product"} className="btn btn-circle btn-ghost btn-sm">
          <FaArrowLeft />
        </Link>
        <p className="text-sm">Perbarui Barang</p>
        <Link href={""} className="btn btn-circle btn-ghost btn-sm">
          <BsThreeDotsVertical />
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2 p-4 pb-32 min-h-svh">
        <div>
          <Image
            width={1000}
            height={225}
            src={dataProduct?.icon || "/images/unknown4x4.png"}
            className="w-full"
            alt={"Product Image"}
            priority
          />
        </div>
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Foto Barang</span>
            </div>
            <input
              type="file"
              className="file-input-bordered w-full file-input"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Nama Barang</span>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nama barang"
              className="input-bordered w-full input"
            />
          </label>
        </div>
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Deskripsi Barang</span>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea-bordered h-24 textarea"
              placeholder="Deskripsi barang"
            ></textarea>
          </label>
        </div>
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Harga Barang</span>
            </div>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Harga barang"
              className="input-bordered w-full input"
            />
          </label>
        </div>
        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Stok</span>
            </div>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Jumlah stok"
              className="input-bordered w-full input"
            />
          </label>
        </div>
        <div>
          {
            isNewCategory ? (
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Nama Kategori</span>
                </div>
                <input
                  type="text"
                  name="category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nama barang"
                  className="input-bordered w-full input"
                />
              </label>
            ) : (
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Kategori</span>
                </div>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full select-bordered select"
                >
                  <option value="">Pilih Kategori</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label >
            )
          }
        </div >
        <div>
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text">Buat Kategori Baru</span>
              <input
                type="checkbox"
                className="toggle"
                checked={isNewCategory}
                onChange={(e) => {
                  setIsNewCategory(e.target.checked);
                }}
              />
            </label>
          </div>
        </div>
        <div className="pt-4">
          <button type="submit" className="w-full btn btn-primary">
            Simpan Perubahan
          </button>
        </div>
      </form >
    </>
  );
}
