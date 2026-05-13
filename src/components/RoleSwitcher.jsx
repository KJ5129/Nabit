'use client'
import { setRole } from '../app/actions'
import { useRouter } from 'next/navigation'
export default function RoleSwitcher({ role, id }) {
    const router = useRouter()
    const currentRole = role === 'deliverer' ? 'requester' : 'deliverer'
    const label = role === 'deliverer' ? 'Switch to Deliverer' : 'Switch to Requester'
    const handleSwitch = async () => {
        await setRole(role, id)
        router.push('/dashboard')
    }
    return (
        <>
            <h1 className="text-4xl font-bold text-center mt-10 mb-3">Role Switcher</h1>
            <div className="rounded-lg ring-1 ring-gray-400 text-center bg-gray-100 dark:bg-gray-600 p-5 w-200 mx-auto shadow-lg mt-8">
                <div className="space-y-2 text-center italic p-5">
                    <p>You are currently signed in as a <strong>{currentRole}</strong>.</p>
                    <p>Click below to switch your role.</p>
                </div>
                <button onClick={handleSwitch} className="w-52 h-10 bg-rose-600 hover:bg-red-700 text-white rounded-2xl block mx-auto mt-3">
                    {label}
                </button>
                <p className="text-sm text-gray-400 mt-4">You will be taken back to your dashboard after switching.</p>
            </div>
        </>
    )
}
