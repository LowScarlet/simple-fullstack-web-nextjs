import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"
import { OrderMethod } from '@prisma/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string, orderType: string }> | { userId: string, orderType: string } }
) {
  try {
    const body = await req.json()
    const resolvedParams = await Promise.resolve(params);
    const userId = resolvedParams.userId;
    const orderType = resolvedParams.orderType;

    const cartData = await myPrisma.cart.findMany({
      where: {
        userId: parseInt(userId, 10)
      },
      include: {
        product: true
      }
    });

    const data = await myPrisma.order.createMany({
      data: cartData.map((cart) => ({
        quantity: cart.quantity,
        duration: cart.duration,
        price: cart.product.price * cart.quantity * cart.duration,
        method: orderType === 'pickup' ? OrderMethod.Pick_Up : OrderMethod.COD,
        codLocation: body.codLocation,
        productId: cart.productId,
        userId: parseInt(userId, 10),
      }))
    });

    await myPrisma.cart.deleteMany({
      where: {
        userId: parseInt(userId, 10)
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