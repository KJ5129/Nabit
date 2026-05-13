import Logout from '../../../components/Logout';
import RequesterDashboard from '../../../components/requester/RequesterDashboard';
import DelivererDashboard from '../../../components/deliverer/DelivererDashboard';
import { auth } from '../../../auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // BUG FIX: if session is somehow null here (layout redirect can race), handle it cleanly.
  if (!session) redirect('/sign-in');

  // BUG FIX: a user who navigates directly to /dashboard before completing onboarding
  // would crash because activeRole is null. Redirect them to finish onboarding first.
  if (!session.user.onboardingComplete) redirect('/onboarding');

  const role = session.user.activeRole;
  const name = session.user.name.split(' ')[0];
  const user_id = session.user.id;

  return (
    <div>
      {role === 'requester' ? (
        <RequesterDashboard name={name} id={user_id} />
      ) : (
        <DelivererDashboard id={user_id} />
      )}
      <Logout />
    </div>
  );
}
