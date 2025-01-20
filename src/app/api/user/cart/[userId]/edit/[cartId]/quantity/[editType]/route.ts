import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string, cartId: string, editType: string }> | { userId: string, cartId: string, editType: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const userId = resolvedParams.userId;
    const cartId = resolvedParams.cartId;
    const editType = resolvedParams.editType;

    const data = await myPrisma.cart.update({
      where: {
        userId: parseInt(userId, 10),
        id: parseInt(cartId, 10)
      },
      data: {
        quantity: {
          [editType]: 1
        }
      },
      include: {
        product: true
      }
    });

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}