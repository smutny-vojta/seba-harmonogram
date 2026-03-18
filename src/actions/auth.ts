"use server";

import { userDal } from "@/dal/user.dal";
import { auth } from "@/lib/auth";
import {
  CZECH_PHONE_REGEX,
  CZECH_PHONE_PREFIX,
  CZECH_PHONE_REGEX_WITH_PREFIX,
  OTP_REGEX,
  PASSWORD_REGEX,
} from "@/lib/consts";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { actionClient } from "@/lib/safe-action";

// ######################################################################
// #
// #    PHASE 1 - SEND OTP
// #
// ######################################################################

const sendOtpSchema = z.object({
  phone: z
    .string()
    .regex(CZECH_PHONE_REGEX, "Telefonní číslo musí mít 9 číslic"),
});

export const redirectUserOrSendOtpAction = actionClient
  .inputSchema(sendOtpSchema)
  .action(async ({ parsedInput }) => {
    const phoneNumber = CZECH_PHONE_PREFIX + parsedInput.phone;
    const users = await userDal.listUsers();
    const user = users.find((user) => user.phoneNumber === phoneNumber);

    if (!user) {
      throw new Error("S tímto telefonním číslem se nelze přihlásit.");
    }

    if (user.phoneNumberVerified) {
      return { phoneNumber, verified: true };
    }

    await auth.api.sendPhoneNumberOTP({
      body: {
        phoneNumber: phoneNumber,
      },
    });

    return { phoneNumber, verified: false };
  });

// ######################################################################
// #
// #    PHASE 2 - VERIFY OTP
// #
// ######################################################################

const verifyOtpSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      CZECH_PHONE_REGEX_WITH_PREFIX,
      'Telefonní číslo musí být ve formátu "+420123456789".',
    ),
  otp: z.string().regex(OTP_REGEX, "Kód musí mít 6 číslic"),
});

export const verifyOtpAction = actionClient
  .inputSchema(verifyOtpSchema)
  .action(async ({ parsedInput }) => {
    try {
      await auth.api.verifyPhoneNumber({
        body: {
          phoneNumber: parsedInput.phoneNumber,
          code: parsedInput.otp,
        },
      });

      return { success: true };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

// ######################################################################
// #
// #    PHASE 3 - SET PASSWORD
// #
// ######################################################################

const verifySetPasswordSchema = z
  .object({
    phoneNumber: z
      .string()
      .regex(
        CZECH_PHONE_REGEX_WITH_PREFIX,
        'Telefonní číslo musí být ve formátu "+420123456789".',
      ),
    password: z
      .string()
      .regex(
        PASSWORD_REGEX,
        "Heslo musí být alespoň 8 znaků dlouhé, obsahovat alespoň 1 velké písmeno a 1 číslo.",
      ),
    confirmPassword: z
      .string()
      .regex(
        PASSWORD_REGEX,
        "Heslo musí být alespoň 8 znaků dlouhé, obsahovat alespoň 1 velké písmeno a 1 číslo.",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hesla se neshodují",
    path: ["confirmPassword"],
  });

export const setPasswordAction = actionClient
  .inputSchema(verifySetPasswordSchema)
  .action(async ({ parsedInput }) => {
    const userHeaders = await headers();

    try {
      await auth.api.setPassword({
        body: {
          newPassword: parsedInput.password,
        },
        headers: userHeaders,
      });

      const session = await auth.api.getSession({
        query: {
          disableCookieCache: true,
        },
        headers: userHeaders,
      });

      await userDal.updateEmailVerified(session!.user.id, true);

      return { success: true, phoneNumber: parsedInput.phoneNumber };
    } catch (error) {
      throw new Error((error as Error).message);
    }
  });

// ######################################################################
// #
// #    PHASE 4 - LOGIN
// #
// ######################################################################

const verifyLoginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      CZECH_PHONE_REGEX_WITH_PREFIX,
      'Telefonní číslo musí být ve formátu "+420123456789".',
    ),
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      "Heslo musí být alespoň 8 znaků dlouhé, obsahovat alespoň 1 velké písmeno a 1 číslo.",
    ),
});

export const loginAction = actionClient
  .inputSchema(verifyLoginSchema)
  .action(async ({ parsedInput }) => {
    try {
      await auth.api.signInPhoneNumber({
        body: {
          phoneNumber: parsedInput.phoneNumber,
          password: parsedInput.password,
          rememberMe: true,
        },
      });
    } catch (error) {
      throw new Error((error as Error).message);
    }

    redirect("/");
  });

// ######################################################################
// #
// #    LOGOUT
// #
// ######################################################################

export const logoutAction = actionClient.action(async () => {
  const data = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: await headers(),
  });

  if (!data) {
    return;
  }

  await auth.api.revokeSession({
    body: { token: data.session.token },
    headers: await headers(),
  });

  await auth.api.signOut({
    query: {
      disableCookieCache: true,
    },
    headers: await headers(),
  });

  redirect("/");
});
