import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      expiresAt?: string | null
      isTempAdmin?: boolean
    } & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        
        const user = await prisma.user.findFirst({
          where: { username: credentials.username as string }
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password as string, user.password)

        if (!isValid) return null
        if (!user.active) return null

        // Check account expiration if expiresAt is set
        if (user.expiresAt && new Date() > new Date(user.expiresAt)) {
          return null // Expired account cannot log in
        }

        return {
          id: user.id,
          name: user.name,
          role: user.role,
          expiresAt: user.expiresAt ? user.expiresAt.toISOString() : null,
          isTempAdmin: !!user.expiresAt,
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // @ts-ignore
        token.role = user.role
        // @ts-ignore
        token.expiresAt = user.expiresAt
        // @ts-ignore
        token.isTempAdmin = user.isTempAdmin
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.expiresAt = token.expiresAt as string | null
        session.user.isTempAdmin = token.isTempAdmin as boolean
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' }
})
