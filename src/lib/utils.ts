import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export function generateTicketNumber(lastNumber: number = 0): string {
  const dateStr = format(new Date(), 'yyyyMMdd')
  const nextNum = (lastNumber + 1).toString().padStart(4, '0')
  return `IC-${dateStr}-${nextNum}`
}

export function formatDate(date: Date | string | number): string {
  if (!date) return '-'
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: th })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    RECEIVED: 'รับเครื่อง',
    DIAGNOSING: 'กำลังตรวจสอบ',
    WAITING_PARTS: 'รออะไหล่',
    REPAIRING: 'กำลังซ่อม',
    COMPLETED: 'ซ่อมเสร็จ',
    DELIVERED: 'ส่งมอบแล้ว',
    CANCELLED: 'ยกเลิก',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    RECEIVED: 'bg-blue-100 text-blue-800 border-blue-200',
    DIAGNOSING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    WAITING_PARTS: 'bg-orange-100 text-orange-800 border-orange-200',
    REPAIRING: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    DELIVERED: 'bg-slate-100 text-slate-800 border-slate-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getDeviceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    PC: 'พีซี (PC)',
    NOTEBOOK: 'โน๊ตบุ๊ค (Notebook)',
    PRINTER: 'เครื่องพิมพ์ (Printer)',
    OTHER: 'อื่นๆ',
  }
  return labels[type] || type
}
