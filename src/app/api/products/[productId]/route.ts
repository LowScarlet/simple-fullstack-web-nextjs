import { NextRequest, NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';
import { myPrisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const formData = await request.formData();
    const productId = parseInt(params.productId);

    // Prepare update data
    const updateData: any = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      categoryId: parseInt(formData.get('categoryId') as string),
    };

    // Handle image upload if present
    const icon = formData.get('icon') as File;
    if (icon) {
      const bytes = await icon.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const filename = `product-${productId}-${Date.now()}${path.extname(icon.name)}`;
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

      // Save file
      await writeFile(filepath, buffer);
      updateData.icon = `/uploads/${filename}`;
    }

    // Update product in database
    const updatedProduct = await myPrisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
