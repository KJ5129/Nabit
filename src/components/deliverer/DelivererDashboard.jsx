'use client';
import { fetcher } from '../../app/utils';
import useSWR from 'swr';
import { acceptRequest, updateStatus } from '../../app/actions';
import { useState, useEffect } from 'react';
import { signOut } from '../../auth-client';
import { useRouter } from 'next/navigation';

export default function DelivererDashboard({ id }) {
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const {
    data: activeOrder,
    error: activeOrderError,
    isLoading: activeOrderLoading,
    mutate: mutateActive,
  } = useSWR(`/api/requests/${id}/active`, fetcher, { refreshInterval: 3000 });

  const { data: pendingOrder, error: pendingOrderError, isLoading: pendingOrderLoading } = useSWR(
    activeOrder ? null : '/api/requests/pending',
    fetcher,
    { refreshInterval: 3000 }
  );

  const Homepage = () => router.push('/');
  const handleGoogleSignOut = () => signOut();

  // BUG FIX: added mutateActive to the dependency array so the effect re-runs
  // correctly. Also changed mutate(null) → mutate() so SWR re-fetches instead
  // of permanently setting the cached value to null (which hid new requests).
  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => {
        setIsComplete(false);
        mutateActive(); // revalidate instead of poisoning the cache
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [isComplete, mutateActive]);

  const handleAccept = async (requestId) => {
    const res = await acceptRequest(id, requestId);
    if (res.success) {
      setErrorMessage(null);
      mutateActive(); // immediately reflect accepted state
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleStatus = async (status, requestId) => {
    const res = await updateStatus(status, requestId);
    if (res.success) {
      setErrorMessage(null);
      mutateActive();
    } else {
      setErrorMessage(res.message);
    }
    return res;
  };

  if (activeOrderError) return <div>There was an issue getting your active order.</div>;
  if (activeOrderLoading) return <div>Loading...</div>;

  if (isComplete) {
    return (
      <>
        <div className="text-4xl font-bold text-center mt-10 mb-3">
          -You have fulfilled the order!-
        </div>
        <div className="flex items-center flex-row-reverse gap-10 justify-center p-50">
          <img className="size-60" src="/nabitlogod.png" alt="Nabit Logo" />
          <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 flex flex-row flex-wrap text-center h-full dark:bg-gray-800 w-100 h-45 shadow-lg p-8 gap-2">
            <div className="text-center text-black dark:text-white">
              <h1 className="text-3xl font-semibold italic p-8">Order Delivered</h1>
              <p className="text-lg p-1 text-gray-500 dark:text-gray-400">
                The order has been delivered. Thank you for choosing Nabit!
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (activeOrder) {
    if (activeOrder.status === 'accepted') {
      return (
        <div>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <h1 className="text-4xl font-bold text-center mt-10 mb-3">-Pickup Information-</h1>
          <div className="flex items-center flex-row-reverse gap-10 justify-center p-50">
            <img className="size-60" src="/nabitlogod.png" alt="Nabit Logo" />
            <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 flex flex-row flex-wrap h-full dark:bg-gray-800 w-100 shadow-lg p-8 gap-2">
              <div className="text-center text-black dark:text-white">
                {/* BUG FIX: original said "You maked" – fixed typo */}
                <h1 className="text-3xl font-semibold italic p-8">You accepted this order!</h1>
                <div className="text-md p-1 text-black dark:text-white">
                  <p>
                    <span className="font-semibold italic">1. Head to </span>
                    {activeOrder.restaurant}
                  </p>
                  <div className="space-y-2 text-center p-5">
                    <p>
                      <span className="font-semibold italic">You are picking up: </span>
                      {activeOrder.delivery_contents}
                    </p>
                    <p>
                      <span className="font-semibold italic">Confirmation number: </span>
                      {activeOrder.confirmation_number}
                    </p>
                  </div>
                  <button
                    onClick={() => handleStatus('picked_up', activeOrder.id)}
                    className="w-52 h-10 bg-rose-600 dark:hover:bg-blue-950 dark:bg-blue-900 hover:bg-red-700 text-white rounded-2xl block mx-auto mt-10"
                  >
                    Mark as picked up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeOrder.status === 'picked_up') {
      return (
        <div>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <h1 className="text-4xl font-bold text-center mt-10 mb-3">-Drop Off Location-</h1>
          <div className="flex items-center flex-row-reverse gap-10 justify-center p-50">
            <img className="size-60" src="/nabitlogod.png" alt="Nabit Logo" />
            <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 flex flex-row flex-wrap h-full dark:bg-gray-800 w-100 shadow-lg p-8 gap-2">
              <div className="text-center text-black dark:text-white">
                <h1 className="text-3xl font-semibold italic p-8">Almost there!</h1>
                <p className="text-lg p-1 text-gray-500 dark:text-gray-400">
                  When you arrive, mark the order as delivered.
                </p>
                <h1>
                  <span className="font-semibold italic">2. Head to </span>
                  {activeOrder.drop_off_spot}
                </h1>
                <button
                  onClick={async () => {
                    const res = await handleStatus('delivered', activeOrder.id);
                    if (res.success) setIsComplete(true);
                  }}
                  className="w-52 h-10 bg-rose-600 hover:bg-red-700 dark:hover:bg-blue-950 dark:bg-blue-900 text-white rounded-2xl block mx-auto mt-10"
                >
                  Mark as delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (pendingOrderError) return <div>Failed to get open requests.</div>;
  if (pendingOrderLoading) return <div>Loading...</div>;

  if (!pendingOrder || pendingOrder.length === 0) {
    return (
      <>
        <h1 className="text-4xl font-bold text-center mt-10 mb-3">
          -Welcome back Nabit Deliverer!-
        </h1>
        <div className="flex justify-center text-center colour-gray-800 dark:text-gray-300 text-gray-500 text-lg">
          Current role: Deliverer!
        </div>
        <div className="pt-16 flex mx-auto items-start">
          <img className="g-5 p-3 w-50 h-45 mx-auto mt-8" src="/nabitlogod.png" alt="Nabit Logo" />
        </div>
        <div className="pt-16 flex max-w-4l mx-auto dark:text-white flex-wrap items-start">
          <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 dark:bg-gray-800 w-150 h-25 mx-auto shadow-lg mt-8">
            <p className="space-y-2 text-center italic">Searching for requests</p>
            <p className="text-md p-1 text-gray-500 dark:text-gray-400">
              Currently no requests available.
            </p>
          </div>
          <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 dark:bg-gray-800 w-100 h-45 mx-auto shadow-lg mt-8">
            <p className="space-y-2 text-center italic">Sign out?</p>
            <p className="text-md p-1 text-gray-500 dark:text-gray-400">click button below</p>
            <button
              onClick={handleGoogleSignOut}
              className="w-52 h-10 bg-rose-600 hover:bg-red-700 dark:hover:bg-blue-950 dark:bg-blue-900 text-white rounded-2xl block mx-auto mt-10"
            >
              Sign out
            </button>
          </div>
          <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 dark:bg-gray-800 w-100 h-45 mx-auto shadow-lg mt-8">
            <p className="space-y-2 text-center italic">Leave the dashboard?</p>
            <p className="text-md p-1 text-gray-500 dark:text-gray-400">Takes you to home page!</p>
            <button
              onClick={Homepage}
              className="w-52 h-10 bg-rose-600 hover:bg-red-700 dark:hover:bg-blue-950 dark:bg-blue-900 text-white rounded-2xl block mx-auto mt-10"
            >
              Home page
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      {pendingOrder.map((request) => (
        <div key={request.id}>
          <h1 className="text-4xl font-bold text-center mt-10 mb-3">New Request Incoming!</h1>
          <div className="flex items-center flex-row-reverse gap-10 justify-center p-50">
            <img className="size-60" src="/nabitlogod.png" alt="Nabit Logo" />
            <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 flex flex-row flex-wrap h-full dark:bg-gray-800 w-100 shadow-lg p-8 gap-2">
              <div className="text-center text-black dark:text-white">
                <h1 className="text-3xl font-semibold italic p-8">
                  Pickup information from Requester
                </h1>
                <h1 className="text-lg p-1 text-gray-500 dark:text-gray-400">Order details:</h1>
                <div className="text-md p-1 text-black dark:text-white">
                  <p>
                    <span className="font-semibold italic">Ordered from: </span>
                    {request.restaurant}
                  </p>
                  <p>
                    <span className="font-semibold italic">Item(s): </span>
                    {request.delivery_contents}
                  </p>
                  <p>
                    <span className="font-semibold italic">Deliver to: </span>
                    {request.drop_off_spot}
                  </p>
                  <p>
                    <span className="font-semibold italic">Room/floor: </span>
                    {request.room_floor}
                  </p>
                  <p>
                    <span className="font-semibold italic">Confirmation Number: </span>
                    {request.confirmation_number}
                  </p>
                  <p>
                    <span className="font-semibold italic">Compensation: $</span>
                    {request.tip_amount}
                  </p>
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="w-52 h-10 bg-rose-600 dark:hover:bg-blue-950 dark:bg-blue-900 hover:bg-red-700 text-white rounded-2xl block mx-auto mt-10"
                  >
                    Accept request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
