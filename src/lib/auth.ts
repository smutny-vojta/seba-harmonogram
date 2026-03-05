import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@lib/db";
import { admin, phoneNumber } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  advanced: {
    cookiePrefix: "auth",
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    admin(),
    nextCookies(),
    phoneNumber({
      otpLength: 6,
      sendOTP: ({ phoneNumber, code }, ctx) => {
        // Implement sending OTP code via SMS
        console.log(phoneNumber, code);
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // Cache duration in seconds (1 day)
      strategy: "compact",
    },
    disableSessionRefresh: true,
    expiresIn: 60 * 60 * 24 * 10,
  },
});
