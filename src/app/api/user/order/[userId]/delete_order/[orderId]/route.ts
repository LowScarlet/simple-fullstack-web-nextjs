import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string, orderId: string }> | { userId: string, orderId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const userId = resolvedParams.userId;
    const orderId = resolvedParams.orderId;

    const data = await myPrisma.order.delete({
      where: {
        id: parseInt(orderId, 10),
        userId: parseInt(userId, 10),
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