import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const techPassword = await bcrypt.hash('tech123', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      name: 'ผู้ดูแลระบบ',
      role: 'ADMIN',
      phone: '0812345678',
      active: true,
    },
  })

  const tech = await prisma.user.upsert({
    where: { username: 'tech1' },
    update: {},
    create: {
      username: 'tech1',
      password: techPassword,
      name: 'ช่างสมชาย',
      role: 'TECHNICIAN',
      phone: '0898765432',
      active: true,
    },
  })

  const customer = await prisma.customer.upsert({
    where: { phoneNumber: '0855555555' },
    update: {},
    create: {
      name: 'ลูกค้า ทดสอบ',
      phoneNumber: '0855555555',
      email: 'customer@example.com',
      address: '123 Test St, Bangkok',
    },
  })

  await prisma.repairJob.create({
    data: {
      ticketNumber: 'IC-20250720-0001',
      customerId: customer.id,
      technicianId: tech.id,
      deviceType: 'NOTEBOOK',
      deviceBrand: 'Asus',
      deviceModel: 'ROG Zephyrus',
      deviceSerial: 'SN123456789',
      description: 'จอไม่ติด เปิดไม่ขึ้นภาพ',
      diagnosis: 'การ์ดจอเสีย',
      status: 'DIAGNOSING',
      partsCost: 0,
      serviceCost: 0,
      totalCost: 0,
    }
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
