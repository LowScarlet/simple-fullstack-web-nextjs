/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { myPrisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const data = await myPrisma.product.findMany({
      include: {
        category: true,
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await myPrisma.product.create({
      data: {
        name: `Product ${Math.random().toString(36).substring(7)}`,
        description: `Description for product ${Math.random().toString(36).substring(7)}`,
        price: 0,
        stock: 0,
      }
    })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    let gggg = null;
    if (body.newCategory) {
      gggg = await myPrisma.productCategory.create(
        {
          data: {
            name: body.newCategory,
            description: 'test'
          }
        }
      )
    }
    
    const data = await myPrisma.product.update({
      where: {
        id: body.id
      },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
        categoryId: gggg ? gggg.id : body.categoryId
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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 })
    }

    const data = await myPrisma.product.delete({
      where: {
        id: parseInt(id)
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