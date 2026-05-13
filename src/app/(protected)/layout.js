import { redirect } from "next/navigation"
import { auth } from "../../auth"
import { headers } from "next/headers"
export default async function ProtectedLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")
  return <>{children}</>
}
