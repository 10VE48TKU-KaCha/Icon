import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.findUnique({
      where: { phoneNumber: phone },
      include: {
        repairJobs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      return NextResponse.json([], { status: 200 }); // Return empty array if no customer found
    }

    return NextResponse.json(customer.repairJobs);
  } catch (error) {
    console.error('Error tracking repair jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
