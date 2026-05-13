import Login from '../../components/Login'
import { redirect } from "next/navigation"
import { auth } from "../../auth"
import { headers } from "next/headers"
export default async function SignIn() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session){
    if (session.user.onboardingComplete == false){ redirect('/onboarding'); }
    else { redirect('/dashboard'); }
  }
  return <Login/>;
}
