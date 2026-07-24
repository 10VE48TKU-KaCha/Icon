import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        phone: true,
        active: true,
        expiresAt: true,
        createdAt: true,
        _count: {
          select: { repairJobs: { where: { status: 'COMPLETED' } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, password, name, role, phone } = body;

    const isCallerTempAdmin = !!session.user.expiresAt || !!session.user.isTempAdmin;

    // Temporary Admin is ONLY allowed to create a permanent ADMIN account
    if (isCallerTempAdmin && role !== 'ADMIN') {
      return Response.json(
        { error: 'บัญชี Admin ชั่วคราวสามารถสร้างได้เฉพาะบัญชี Admin หลักเท่านั้น' },
        { status: 400 }
      );
    }

    if (!username || !password || !name) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return Response.json({ error: 'Username already taken' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role: role || 'TECHNICIAN',
        phone
      }
    });

    // If a permanent ADMIN account is created, delete all temporary setup admin accounts
    let tempAdminDeleted = false;
    if (role === 'ADMIN') {
      const deleteResult = await prisma.user.deleteMany({
        where: {
          expiresAt: { not: null }
        }
      });
      if (deleteResult.count > 0) {
        tempAdminDeleted = true;
      }
    }

    const { password: _, ...userWithoutPassword } = user;
    return Response.json({ ...userWithoutPassword, tempAdminDeleted }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
