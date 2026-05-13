import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient();

export const signIn = async () => {
  await authClient.signIn.social({
    provider: 'google',
    callbackURL: '/dashboard',
  });
};

export const signOut = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        // Use window.location for a hard redirect after sign-out so the
        // server session is fully cleared before the next page renders.
        window.location.href = '/sign-in';
      },
    },
  });
};

// BUG FIX: force a network fetch so the updated role/onboardingComplete
// fields are reflected immediately instead of returning a stale cache hit.
export const refreshSession = async () => {
  return await authClient.getSession({ fetchOptions: { cache: 'no-store' } });
};
