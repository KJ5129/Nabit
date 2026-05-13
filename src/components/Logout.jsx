"use client"
import { signOut } from '../auth-client'
export default function Logout(){
    return <button onClick={signOut}>Sign Out</button>
}
