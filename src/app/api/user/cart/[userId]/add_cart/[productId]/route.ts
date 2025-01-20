import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string, productId: string }> | { userId: string, productId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const userId = resolvedParams.userId;
    const productId = resolvedParams.productId;

    const checkData = await myPrisma.cart.findFirst({
      where: {
        userId: parseInt(userId, 10),
        productId: parseInt(productId, 10)
      }
    });

    let data;

    if (checkData) {
      data = await myPrisma.cart.update({
        where: {
          id: checkData.id
        },
        data: {
          quantity: {
            increment: 1
          }
        },
        include: {
          product: true
        }
      });
    } else {
      data = await myPrisma.cart.create({
        data: {
          userId: parseInt(userId, 10),
          productId: parseInt(productId, 10),
        },
        include: {
          product: true
        }
      });
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}