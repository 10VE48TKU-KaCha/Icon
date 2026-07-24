import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  try {
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { phoneNumber: { contains: q } },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        _count: {
          select: { repairJobs: true }
        }
      }
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, phoneNumber, email, address } = body;

    const existing = await prisma.customer.findUnique({ where: { phoneNumber } });
    if (existing) {
      return NextResponse.json({ error: 'เบอร์โทรศัพท์นี้มีในระบบแล้ว' }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: { name, phoneNumber, email, address },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
