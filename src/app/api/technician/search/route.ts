import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const type = searchParams.get('type') || '';

  try {
    const whereClause: any = {};

    if (q) {
      whereClause.OR = [
        { ticketNumber: { contains: q, mode: 'insensitive' } },
        { customer: { name: { contains: q, mode: 'insensitive' } } },
        { customer: { phoneNumber: { contains: q } } },
      ];
    }
    
    if (status) {
      whereClause.status = status;
    }

    if (type) {
      whereClause.deviceType = type;
    }

    const jobs = await prisma.repairJob.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        customer: true,
      }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
