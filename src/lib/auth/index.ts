import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error('Please enter your email address');
        }
        if (!credentials?.password) {
          throw new Error('Please enter your password');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        console.log('Found user:', user);

        if (!user) {
          throw new Error('No account found with this email address');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log('Password valid:', isPasswordValid);

       if (!isPasswordValid) {
         throw new Error('Invalid password. Please try again');
       }

        return { id: user.id, email: user.email };
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
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.menopauseStage = user.menopauseStage;
      }
      return token;
    },
  },
};
