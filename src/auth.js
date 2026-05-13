import { betterAuth } from 'better-auth';
import { pool } from './app/db';

export const auth = betterAuth({
  // BUG FIX: BETTER_AUTH_URL in the Key file had a trailing period ("http://localhost:3000.")
  // which caused every auth request to fail with an invalid base-URL error.
  // .trim() removes any stray whitespace/punctuation.
  baseURL: (process.env.BETTER_AUTH_URL || '').trim().replace(/\.$/, ''),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  database: pool,
  user: {
    additionalFields: {
      activeRole: {
        type: 'string',
        defaultValue: null,
        required: false,
        input: true,
      },
      onboardingComplete: {
        type: 'boolean',
        defaultValue: false,
        required: false,
        input: true,
      },
    },
  },
});
