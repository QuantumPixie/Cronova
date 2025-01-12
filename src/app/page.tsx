import Image from 'next/image';
import Link from 'next/link';
import { Calendar, BookOpen, LineChart, Shield, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-[#F5F2F2] to-[#F7E8E8]'>
      <nav
        className='bg-gradient-to-r from-[#E3BAB3] to-[#B76E79]'
        role='navigation'
        aria-label='Main navigation'
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center gap-2'>
              <Image
                src='/croNova-logo.webp'
                alt='CroNova Logo'
                width={32}
                height={32}
                className='h-8 w-8'
              />
              <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#800020] to-[#a36c53]'>
                CroNova
              </span>
            </div>
            <div className='flex gap-4'>
              <Link
                href='/login'
                className='inline-flex items-center px-4 py-2 text-sm font-medium text-[#800020] hover:bg-[#DCB1A7] hover:text-[#800020] rounded-md transition-all duration-200'
                aria-label='Sign in to your account'
              >
                Sign In
              </Link>
              <Link
                href='/register'
                className='inline-flex items-center px-4 py-2 text-sm font-medium bg-[#800020] text-[#E3BAB3] rounded-md hover:bg-[#a36c53] transition-all duration-200'
                aria-label='Get started with CroNova'
              >
                <Sparkles className='w-4 h-4 mr-1' aria-hidden='true' />
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main role='main'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative'>
          <div
            className='absolute top-10 left-10 text-[#FFD700] opacity-30'
            aria-hidden='true'
          >
            <Sparkles className='w-8 h-8' />
          </div>
          <div
            className='absolute bottom-10 right-10 text-[#FFD700] opacity-30'
            aria-hidden='true'
          >
            <Sparkles className='w-8 h-8' />
          </div>

          <div
            className='text-center'
            role='region'
            aria-label='Welcome section'
          >
            <div className='inline-flex items-center gap-2 mb-6'>
              <span className='text-[#FFD700]' aria-hidden='true'>
                <Sparkles className='w-5 h-5' />
              </span>
              <span className='text-[#800020] font-medium'>
                Welcome to Your Journey
              </span>
              <span className='text-[#FFD700]' aria-hidden='true'>
                <Sparkles className='w-5 h-5' />
              </span>
            </div>
            <h1 className='text-4xl font-bold text-[#800020] sm:text-5xl md:text-6xl'>
              Track Your Menopause Journey
            </h1>
            <p className='mt-3 max-w-md mx-auto text-base text-[#4A4A4A] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
              Personalized symptom tracking, journaling, and AI-powered insights
              to help you navigate your menopause experience with confidence.
            </p>
            <div
              className='mt-8 flex justify-center gap-4'
              role='group'
              aria-label='Get started options'
            >
              <Link
                href='/register'
                className='rounded-md bg-[#B76E79] px-8 py-3 text-base font-medium text-white hover:bg-[#a36c53] md:py-4 md:px-10 md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl border border-[#FFD700]'
                aria-label='Start your journey with CroNova'
              >
                <span className='flex items-center gap-2'>
                  Start Your Journey
                  <Sparkles className='w-5 h-5' aria-hidden='true' />
                </span>
              </Link>
              <Link
                href='/login'
                className='rounded-md border-2 border-[#800020] px-8 py-3 text-base font-medium text-[#800020] hover:bg-[#E3BAB3] md:py-4 md:px-10 md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl'
                aria-label='Sign in to your account'
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        <div
          className='bg-gradient-to-b from-white to-[#F7E8E8] py-24 relative'
          role='region'
          aria-label='Features section'
        >
          <div
            className='absolute top-0 left-1/4 text-[#FFD700] opacity-20'
            aria-hidden='true'
          >
            <Sparkles className='w-6 h-6' />
          </div>
          <div
            className='absolute bottom-0 right-1/4 text-[#FFD700] opacity-20'
            aria-hidden='true'
          >
            <Sparkles className='w-6 h-6' />
          </div>

          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-[#800020]'>
                Features Designed for You
              </h2>
              <p className='mt-4 text-[#4A4A4A]'>
                Everything you need to understand and manage your symptoms
              </p>
            </div>

            <div className='mt-20'>
              <div
                className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'
                role='list'
                aria-label='Feature list'
              >
                {/* Symptom Tracking */}
                <div
                  className='flex flex-col items-center p-6 rounded-lg border-2 border-[#800020] shadow-md hover:shadow-lg transition-all duration-200 bg-white relative group'
                  role='listitem'
                >
                  <div
                    className='absolute -top-2 -right-2 text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    aria-hidden='true'
                  >
                    <Sparkles className='w-4 h-4' />
                  </div>
                  <div className='p-3 bg-[#E3BAB3] rounded-lg'>
                    <Calendar
                      className='w-6 h-6 text-[#800020]'
                      aria-hidden='true'
                    />
                  </div>
                  <h3 className='mt-4 text-lg font-medium text-[#800020]'>
                    Symptom Tracking
                  </h3>
                  <p className='mt-2 text-center text-[#4A4A4A]'>
                    Log and monitor your symptoms with our easy-to-use tracking
                    system
                  </p>
                </div>

                {/* Journal Entries */}
                <div
                  className='flex flex-col items-center p-6 rounded-lg border-2 border-[#800020] shadow-md hover:shadow-lg transition-all duration-200 bg-white relative group'
                  role='listitem'
                >
                  <div
                    className='absolute -top-2 -right-2 text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    aria-hidden='true'
                  >
                    <Sparkles className='w-4 h-4' />
                  </div>
                  <div className='p-3 bg-[#E3BAB3] rounded-lg'>
                    <BookOpen
                      className='w-6 h-6 text-[#800020]'
                      aria-hidden='true'
                    />
                  </div>
                  <h3 className='mt-4 text-lg font-medium text-[#800020]'>
                    Personal Journal
                  </h3>
                  <p className='mt-2 text-center text-[#4A4A4A]'>
                    Document your journey with private, secure journal entries
                  </p>
                </div>

                {/* AI Insights */}
                <div
                  className='flex flex-col items-center p-6 rounded-lg border-2 border-[#800020] shadow-md hover:shadow-lg transition-all duration-200 bg-white relative group'
                  role='listitem'
                >
                  <div
                    className='absolute -top-2 -right-2 text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    aria-hidden='true'
                  >
                    <Sparkles className='w-4 h-4' />
                  </div>
                  <div className='p-3 bg-[#E3BAB3] rounded-lg'>
                    <LineChart
                      className='w-6 h-6 text-[#800020]'
                      aria-hidden='true'
                    />
                  </div>
                  <h3 className='mt-4 text-lg font-medium text-[#800020]'>
                    AI-Powered Insights
                  </h3>
                  <p className='mt-2 text-center text-[#4A4A4A]'>
                    Receive personalized insights and recommendations based on
                    your data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer
          className='bg-gradient-to-r from-[#E3BAB3] to-[#B76E79]'
          role='contentinfo'
        >
          <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <Image
                  src='/logo.webp'
                  alt='CroNova Logo'
                  width={24}
                  height={24}
                  className='h-6 w-6'
                />
                <span className='text-lg font-bold text-[#800020]'>
                  CroNova
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm text-[#800020]'>
                <Shield className='w-4 h-4' aria-hidden='true' />
                <span>Your data is secure and private</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
