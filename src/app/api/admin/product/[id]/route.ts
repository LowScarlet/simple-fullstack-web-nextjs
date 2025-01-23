import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await myPrisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      }
    })
    
    if (!data) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}
