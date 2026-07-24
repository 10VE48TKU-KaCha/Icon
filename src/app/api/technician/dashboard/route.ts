import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const technicianId = session.user?.id;

    // Summary stats
    const [pendingCount, repairingCount, completedTodayCount] = await Promise.all([
      prisma.repairJob.count({
        where: { status: 'RECEIVED' },
      }),
      prisma.repairJob.count({
        where: { status: 'REPAIRING' },
      }),
      prisma.repairJob.count({
        where: {
          status: 'COMPLETED',
          updatedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    // Recent jobs for this technician
    const recentJobs = await prisma.repairJob.findMany({
      where: { technicianId },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: {
        customer: {
          select: { name: true, phoneNumber: true },
        },
      },
    });

    return NextResponse.json({
      summary: {
        pending: pendingCount,
        repairing: repairingCount,
        completedToday: completedTodayCount,
      },
      recentJobs,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
