import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const technicianId = searchParams.get('technicianId');
  const search = searchParams.get('search') || '';

  try {
    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (technicianId) whereClause.technicianId = technicianId;
    if (search) {
      whereClause.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { customer: { phoneNumber: { contains: search } } }
      ];
    }

    const jobs = await prisma.repairJob.findMany({
      where: whereClause,
      include: {
        customer: true,
        technician: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return Response.json(jobs);
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
    
    // Generate ticketNumber IC-YYYYMMDD-XXXX
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const prefix = `IC-${dateStr}-`;
    
    const latestJob = await prisma.repairJob.findFirst({
      where: { ticketNumber: { startsWith: prefix } },
      orderBy: { ticketNumber: 'desc' }
    });
    
    let sequence = 1;
    if (latestJob) {
      const lastSeq = parseInt(latestJob.ticketNumber.split('-')[2], 10);
      if (!isNaN(lastSeq)) sequence = lastSeq + 1;
    }
    
    const ticketNumber = `${prefix}${sequence.toString().padStart(4, '0')}`;
    
    const job = await prisma.repairJob.create({
      data: {
        ...body,
        ticketNumber,
        status: 'RECEIVED'
      }
    });

    return Response.json(job, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
