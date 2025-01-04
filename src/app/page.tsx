export default function Home() {
  return (
    <div className='p-6'>
      <h1>Welcome to CroNova</h1>
      <p>Track and manage your menopause journey</p>

      <div className='mt-6'>
        <a href='/login' className='px-4 py-2 bg-blue-600 text-white rounded'>
          Sign In
        </a>
        <a href='/register' className='ml-4 px-4 py-2 border rounded'>
          Register
        </a>
      </div>
    </div>
  );
}
