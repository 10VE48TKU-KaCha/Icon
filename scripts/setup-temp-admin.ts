import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const prisma = new PrismaClient()

function generateRandomPassword(length = 10): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let retVal = ''
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(crypto.randomInt(0, n))
  }
  return retVal
}

async function main() {
  const now = new Date()

  // 1. Check if permanent admin exists
  const existingPermanentAdmin = await prisma.user.findFirst({
    where: {
      role: 'ADMIN',
      expiresAt: null,
      active: true,
    },
  })

  if (existingPermanentAdmin) {
    console.log('\n❌ [SETUP BLOCKED] มีบัญชี Admin หลักอยู่ในระบบเรียบร้อยแล้ว!')
    console.log(`   (พบผู้ใช้ Admin หลัก: "${existingPermanentAdmin.username}")`)
    console.log('   ไม่สามารถสร้างบัญชี Admin ชั่วคราวใหม่ได้ในขณะนี้\n')
    return
  }

  // 2. Check if active temporary admin exists
  const existingTempAdmin = await prisma.user.findFirst({
    where: {
      expiresAt: {
        gt: now,
      },
    },
  })

  if (existingTempAdmin) {
    console.log('\n⚠️ [SETUP BLOCKED] มีบัญชี Admin ชั่วคราวที่ยังไม่หมดอายุในระบบอยู่แล้ว!')
    console.log(`   (Username: "${existingTempAdmin.username}", หมดอายุ: ${existingTempAdmin.expiresAt?.toLocaleString('th-TH')})`)
    console.log('   ห้ามสร้างบัญชีชั่วคราวซ้ำจนกว่าบัญชีเดิมจะถูกลบหรือหมดอายุ\n')
    return
  }

  // If there's an old expired temp admin, clean it up
  await prisma.user.deleteMany({
    where: {
      expiresAt: {
        lte: now,
      },
    },
  })

  // 3. Generate random password
  const plainPassword = generateRandomPassword(12)
  const hashedPassword = await bcrypt.hash(plainPassword, 10)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  const tempAdmin = await prisma.user.create({
    data: {
      username: 'setup_admin',
      password: hashedPassword,
      name: 'Admin ชั่วคราว (Setup)',
      role: 'ADMIN',
      active: true,
      expiresAt: expiresAt,
    },
  })

  console.log('\n==================================================')
  console.log('🔑 สร้างบัญชี ADMIN ชั่วคราวสำหรับ DEPLOYMENT สำเร็จ!')
  console.log('==================================================')
  console.log(`   Username : ${tempAdmin.username}`)
  console.log(`   Password : ${plainPassword}`)
  console.log(`   Expires  : ${expiresAt.toLocaleString('th-TH')} (ใช้งานได้ 24 ชั่วโมง)`)
  console.log('==================================================')
  console.log('⚠️  ข้อควรทราบ:')
  console.log('   1. บัญชีนี้ใช้สำหรับการสร้างบัญชี Admin หลักในระบบเท่านั้น')
  console.log('   2. เมื่อสร้างบัญชี Admin หลักสำเร็จ บัญชีชั่วคราวนี้จะถูกลบทันที')
  console.log('==================================================\n')
}

main()
  .catch((e) => {
    console.error('Error setting up temp admin:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
