import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@lib/db";
import { phoneNumber } from "better-auth/plugins"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite"
    }),
    emailAndPassword: {
        enabled: false,
    },
    plugins: [
        phoneNumber({
            sendOTP: ({ phoneNumber, code }, ctx) => {
                // Implement sending OTP code via SMS
                console.log(phoneNumber, code);
            }
        })
    ]
});