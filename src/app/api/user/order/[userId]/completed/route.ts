import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"
import { OrderStatus } from '@prisma/client';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> | { userId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const userId = resolvedParams.userId;
    await delay(1000); // 1 second delay
    const data = await myPrisma.order.findMany({
      where: {
        userId: parseInt(userId, 10),
        status: OrderStatus.Completed,
      },
      include: {
        product: true
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}