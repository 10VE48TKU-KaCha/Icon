import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalJobs,
      completedJobs,
      pendingJobs,
      revenueResult,
      jobsToday,
      jobsWeek,
      jobsMonth,
      techStatsRaw,
      monthlyTrends
    ] = await Promise.all([
      prisma.repairJob.count(),
      prisma.repairJob.count({ where: { status: 'COMPLETED' } }),
      prisma.repairJob.count({ where: { status: { notIn: ['COMPLETED', 'DELIVERED', 'CANCELLED'] } } }),
      prisma.repairJob.aggregate({ _sum: { totalCost: true }, _avg: { totalCost: true }, where: { status: { in: ['COMPLETED', 'DELIVERED'] } } }),
      prisma.repairJob.count({ where: { createdAt: { gte: today } } }),
      prisma.repairJob.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.repairJob.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.user.findMany({
        where: { role: 'TECHNICIAN' },
        select: {
          id: true,
          name: true,
          _count: { select: { repairJobs: true } }
        }
      }),
      prisma.$queryRaw`
        SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, COUNT(*)::int as count 
        FROM repair_jobs 
        GROUP BY TO_CHAR("createdAt", 'YYYY-MM') 
        ORDER BY month DESC LIMIT 6
      `
    ]);

    const statusCountsRaw = await prisma.repairJob.groupBy({
      by: ['status'],
      _count: true
    });

    return Response.json({
      summary: {
        totalJobs,
        completedJobs,
        pendingJobs,
        revenue: revenueResult._sum.totalCost || 0,
        averageRevenue: revenueResult._avg.totalCost || 0,
        jobsToday,
        jobsWeek,
        jobsMonth
      },
      statusCounts: statusCountsRaw.map(s => ({ status: s.status, count: s._count })),
      technicianStats: techStatsRaw.map(t => ({ id: t.id, name: t.name, count: t._count.repairJobs })),
      monthlyTrends
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
