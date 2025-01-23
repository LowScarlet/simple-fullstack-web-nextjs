import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"
import { OrderStatus } from '@prisma/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string, orderStatus: string }> | { orderId: string, orderStatus: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const orderId = resolvedParams.orderId;
    const orderStatus = resolvedParams.orderStatus;

    const data = await myPrisma.order.update({
      where: {
        id: parseInt(orderId, 10),
      },
      data: {
        status: OrderStatus[orderStatus as keyof typeof OrderStatus]
      },
    });

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}