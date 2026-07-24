import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

function generateTicketNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `JOB${year}${month}-${random}`;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { customerId, deviceType, deviceBrand, deviceModel, deviceSerial, description } = body;

    if (!customerId || !deviceType || !deviceBrand || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ticketNumber = generateTicketNumber();

    const job = await prisma.repairJob.create({
      data: {
        ticketNumber,
        customerId,
        technicianId: session.user.id,
        deviceType,
        deviceBrand,
        deviceModel,
        deviceSerial,
        description,
        status: 'RECEIVED',
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create repair job' }, { status: 500 });
  }
}
