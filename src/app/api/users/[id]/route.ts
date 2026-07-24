import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const user = await prisma.user.findUnique({
      where: { id: resolvedParams.id },
      select: { id: true, username: true, name: true, role: true, phone: true, active: true, createdAt: true }
    });

    if (!user) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const body = await request.json();
    const dataToUpdate: any = { ...body };

    if (body.password) {
      dataToUpdate.password = await bcrypt.hash(body.password, 10);
    } else {
      delete dataToUpdate.password;
    }

    const updatedUser = await prisma.user.update({
      where: { id: resolvedParams.id },
      data: dataToUpdate,
      select: { id: true, username: true, name: true, role: true, phone: true, active: true }
    });

    return Response.json(updatedUser);
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const user = await prisma.user.update({
      where: { id: resolvedParams.id },
      data: { active: false },
      select: { id: true, username: true, name: true, active: true }
    });

    return Response.json(user);
  } catch (error) {
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
