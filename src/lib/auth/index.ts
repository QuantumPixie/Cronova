import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { checkRateLimit } from '@/lib/services/rate-limit-service';
import type { User } from 'next-auth';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email) {
          throw new Error('Please enter your email address');
        }
        if (!credentials?.password) {
          throw new Error('Please enter your password');
        }

        const rateLimitResult = checkRateLimit(credentials.email);
        if (!rateLimitResult.success) {
          throw new Error(
            `Too many login attempts. Please try again in 15 minutes. ${rateLimitResult.remaining} attempts remaining.`
          );
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            menopauseStage: true,
            emailVerified: true,
            lastPeriodDate: true,
            periodDates: true,
          },
        });

        if (!user) {
          throw new Error('No account found with this email address');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password. Please try again');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          menopauseStage: user.menopauseStage,
          emailVerified: user.emailVerified,
          lastPeriodDate: user.lastPeriodDate,
          periodDates: user.periodDates,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.menopauseStage = token.menopauseStage;
        session.user.emailVerified = token.emailVerified;
        session.user.lastPeriodDate = token.lastPeriodDate;
        session.user.periodDates = token.periodDates;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.menopauseStage = user.menopauseStage;
        token.emailVerified = user.emailVerified;
        token.lastPeriodDate = user.lastPeriodDate;
        token.periodDates = user.periodDates;
      }
      return token;
    },
  },
};
