import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@lib/db";
import { phoneNumber } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    advanced: {
        cookiePrefix: "auth"
    },
    database: drizzleAdapter(db, {
        provider: "sqlite"
    }),
    emailAndPassword: {
        enabled: false,
    },
    plugins: [
        phoneNumber({
            otpLength: 6,
            sendOTP: ({ phoneNumber, code }, ctx) => {
                // Implement sending OTP code via SMS
                console.log(phoneNumber, code);
            }
        }),
        nextCookies()
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60, // Cache duration in seconds (1 hour)
            strategy: "compact"
        },
        disableSessionRefresh: true,
        expiresIn: 60 * 60 * 24 * 10
    },
    user: {
        additionalFields: {
            role: {
                type: ["instr", "programak", "hlavni_programak", "hlavas"],
                required: true,
                defaultValue: "instr",
                input: false, // don't allow user to set role
            },
        },
    },
});