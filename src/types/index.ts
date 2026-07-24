import { RepairJob, Customer, User } from '@prisma/client'

export interface RepairJobWithRelations extends RepairJob {
  customer: Customer
  technician: Omit<User, 'password'> | null
}

export interface DashboardStats {
  totalJobs: number
  pendingJobs: number
  completedJobs: number
  revenue: number
}

export interface SessionUser {
  id: string
  name?: string | null
  role: 'ADMIN' | 'TECHNICIAN'
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}
