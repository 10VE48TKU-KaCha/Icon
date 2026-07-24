import { PrismaClient } from '@prisma/client'

const passwords = [
  'postgres', 'password', '123456', 'root', 'admin', '1234', '12345678', '123456789',
  'admin123', 'root123', 'postgres123', 'icon1234', 'icon_repair', 'icon', 'Pass1234',
  'P@ssword123', 'secret', '12345', 'qwerty', '111111', '1234567890'
];

async function test() {
  for (const pass of passwords) {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://postgres:${encodeURIComponent(pass)}@localhost:5432/icon_repair?schema=public`
        }
      }
    });
    try {
      await prisma.$connect();
      console.log('>>> FOUND WORKING PASSWORD FOR postgres:', pass);
      await prisma.$disconnect();
      return pass;
    } catch (e: any) {
      console.log('Failed for postgres:', pass, e.message ? e.message.split('\n')[0] : e);
      await prisma.$disconnect();
    }
  }

  // Also test user 'user'
  for (const pass of passwords) {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://user:${encodeURIComponent(pass)}@localhost:5432/icon_repair?schema=public`
        }
      }
    });
    try {
      await prisma.$connect();
      console.log('>>> FOUND WORKING PASSWORD FOR user:', pass);
      await prisma.$disconnect();
      return pass;
    } catch (e: any) {
      console.log('Failed for user:', pass, e.message ? e.message.split('\n')[0] : e);
      await prisma.$disconnect();
    }
  }

  console.log('No password matched.');
}

test();
