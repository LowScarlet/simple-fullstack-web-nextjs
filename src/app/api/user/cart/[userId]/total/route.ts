import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> | { userId: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const userId = resolvedParams.userId;
    
    const data = await myPrisma.cart.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
      include: {
        product: true
      }
    })

    const totalCost = data.reduce((total, item) => {
      const { quantity, duration, product } = item;
      const cost = product.price * quantity * duration;
      return total + cost;
    }, 0);

    return NextResponse.json({ totalCost }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}