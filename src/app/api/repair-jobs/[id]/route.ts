import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const job = await prisma.repairJob.findUnique({
      where: { id: resolvedParams.id },
      include: {
        customer: true,
        technician: { select: { id: true, name: true, phone: true } }
      }
    });

    if (!job) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json(job);
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    // Auto-calculate total cost if parts or service cost is provided
    let dataToUpdate = { ...body };
    if (body.partsCost !== undefined || body.serviceCost !== undefined) {
      const existingJob = await prisma.repairJob.findUnique({ where: { id: resolvedParams.id } });
      if (existingJob) {
        const partsCost = body.partsCost !== undefined ? Number(body.partsCost) : existingJob.partsCost;
        const serviceCost = body.serviceCost !== undefined ? Number(body.serviceCost) : existingJob.serviceCost;
        dataToUpdate.partsCost = partsCost;
        dataToUpdate.serviceCost = serviceCost;
        dataToUpdate.totalCost = partsCost + serviceCost;
      }
    }

    const updatedJob = await prisma.repairJob.update({
      where: { id: resolvedParams.id },
      data: dataToUpdate
    });

    return Response.json(updatedJob);
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
