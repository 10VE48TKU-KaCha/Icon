import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  try {
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    return Response.json(customers);
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phoneNumber, email, address } = body;

    if (!name || !phoneNumber) {
      return Response.json({ error: 'Name and phone number are required' }, { status: 400 });
    }

    const existing = await prisma.customer.findUnique({ where: { phoneNumber } });
    if (existing) {
      return Response.json({ error: 'Phone number already exists' }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: { name, phoneNumber, email, address }
    });

    return Response.json(customer, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
