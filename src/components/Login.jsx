"use client"
import { signIn } from '../auth-client'
export default function Login(){
    return (
        <div className="flex items-center justify-center p-50">
            <img className="size-60" src="/nabitlogod.png" alt="Nabit Logo" />
            <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 flex flex-col dark:bg-gray-800 w-100 shadow-lg pb-8">
                <div className="text-center text-black dark:text-white">
                    <p className="text-3xl font-semibold italic p-8">Sign in to Nabit</p>
                    <p>Fast delivery of food on campus from your peers to you!</p>
                    <p className="text-gray-700 dark:text-gray-300 italic p-10 mt-12">Please sign in to continue.</p>
                    <button onClick={signIn} className="w-52 h-10 bg-rose-600 dark:hover:bg-blue-950 dark:bg-blue-900 hover:bg-red-700 text-white rounded-2xl block mx-auto">Sign in with Google</button>
                </div>
            </div>
        </div>
    )
}
