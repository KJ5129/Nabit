'use client';
import { useRouter } from 'next/navigation';

// BUG FIX: The original code compared the imported `signIn` function to `true`
// (e.g. `if (signIn==true)`) which is always false – a function is never === true.
// Those buttons now simply navigate to the correct pages; authentication guards
// on the server (protected layout + sign-in page redirect) handle the rest.
export default function HomePage() {
  const router = useRouter();

  return (
    <div className="gradient-rose-600 dark:text-white p-20">
      <main className="pt-5">
        <h1 className="text-4xl font-bold text-center mb-6">-Welcome to Nabit-</h1>
        <div className="flex justify-center text-center colour-gray-800 dark:text-gray-300 text-gray-500 text-lg">
          <p className="max-w-lg mt-12 overline leading-relaxed">
            Fast delivery of food on campus from your peers to you!
          </p>
        </div>
        <div className="pt-16 flex mx-auto items-start">
          <img className="g-5 p-3 w-50 h-45 mx-auto mt-8" src="/nabitlogod.png" alt="Nabit Logo" />
        </div>
        <div className="max-w-4l flex text-centered justify-center flex-wrap mx-auto dark:text-white p-8 gap-8">
          <div className="space-y-2 text-center text-black-500">
            <p>On a day full of work, you order your food online.</p>
            <p className="text-bold text-2xl">but</p>
            <p>there is no one to pick it for you.</p>
            <p>
              You take the role of{' '}
              <span className="italic hover:underline font-bold">Requester</span>, and a{' '}
              <span className="italic hover:underline">Deliverer</span> delivers it right to your
              specified location.
            </p>
            <p>Easy-Fast-Trustworthy</p>
          </div>
        </div>
        <div className="pt-16 flex max-w-4l mx-auto dark:text-white flex-wrap items-start">
          <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 dark:bg-gray-800 w-100 h-45 mx-auto shadow-lg mt-8">
            <div className="space-y-2 text-center text-black-500 italic">
              <p>New or returning user?</p>
            </div>
            <p className="text-md p-1 text-gray-500 dark:text-gray-400">Sign in to proceed</p>
            <button
              onClick={() => router.push('/sign-in')}
              className="w-52 h-10 bg-rose-600 hover:bg-red-700 dark:hover:bg-blue-950 dark:bg-blue-900 text-white rounded-2xl block mx-auto mt-10"
            >
              Sign in
            </button>
          </div>
          <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 dark:bg-gray-800 w-100 h-45 mx-auto shadow-lg mt-8">
            <div className="space-y-2 text-center text-black-500 italic">
              <p>Looking to deliver or request delivery?</p>
            </div>
            <p className="text-md p-2 text-gray-500 dark:text-gray-400">
              Click the button below for your dashboard page!
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-52 h-10 bg-rose-600 hover:bg-red-700 dark:hover:bg-blue-950 dark:bg-blue-900 text-white rounded-2xl block mx-auto mt-10"
            >
              Dashboard
            </button>
          </div>
          <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 dark:bg-gray-800 w-100 h-45 mx-auto shadow-lg mt-8">
            <div className="space-y-2 text-center text-black-500 italic">
              <p>Need to switch role?</p>
            </div>
            <p className="text-md p-2 text-gray-500 dark:text-gray-400">
              Between deliverers and requesters!
            </p>
            <button
              onClick={() => router.push('/role-switcher')}
              className="w-52 h-10 bg-rose-600 hover:bg-red-700 dark:hover:bg-blue-950 dark:bg-blue-900 text-white rounded-2xl block mx-auto mt-10"
            >
              Switch your role
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
