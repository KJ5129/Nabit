// BUG FIX: Original file was named "Role-switcher-page" (no extension, no sub-directory).
// Next.js App Router requires the file to be page.js inside a folder named after the route.
// Correct location: src/app/(protected)/role-switcher/page.js
import RoleSwitcher from '../../../components/RoleSwitcher';
import { auth } from '../../../auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RoleSwitcherPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/sign-in');

  const currentRole = session.user.activeRole;
  const userId = session.user.id;

  // Toggle to the opposite role
  const nextRole = currentRole === 'requester' ? 'deliverer' : 'requester';

  return <RoleSwitcher role={nextRole} id={userId} />;
}
