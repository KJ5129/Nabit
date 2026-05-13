'use client';
import { setRole } from '../actions';
import { authClient } from '../../auth-client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [user, setUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function setUserId() {
      const session = await authClient.getSession();
      const userId = session?.data?.user?.id;
      if (userId) setUser(userId);
    }
    setUserId();
  }, []);

  // BUG FIX: `redirect()` from next/navigation does NOT work inside a client-side
  // event handler – it throws a special error that only works during SSR/RSC rendering.
  // Replaced with `router.push()` which is the correct client-side navigation method.
  const handleClick = async (role, userId) => {
    const res = await setRole(role, userId);
    if (res.success) {
      router.push('/dashboard');
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center mt-10 mb-3">-First time using Nabit-</h1>
      <div className="flex justify-center text-center colour-gray-800 dark:text-gray-300 text-gray-500 text-lg">
        To get started please select a role
      </div>
      <div className="pt-16 flex mx-auto items-start">
        <img className="g-5 p-3 w-50 h-45 mx-auto mt-8" src="/nabitlogod.png" alt="Nabit Logo" />
      </div>
      <div className="pt-16 flex max-w-4l mx-auto dark:text-white flex-wrap items-start">
        <button
          onClick={() => handleClick('requester', user)}
          className="w-52 h-10 bg-rose-600 hover:bg-red-700 dark:hover:bg-blue-950 dark:bg-blue-900 text-white rounded-2xl block mx-auto mt-10"
        >
          Requester
        </button>
        {/* BUG FIX: button was placed outside the wrapping div in the original, breaking layout */}
        <button
          onClick={() => handleClick('deliverer', user)}
          className="w-52 h-10 bg-rose-600 hover:bg-red-700 dark:hover:bg-blue-950 dark:bg-blue-900 text-white rounded-2xl block mx-auto mt-10"
        >
          Deliverer
        </button>
      </div>
    </>
  );
}
