"use server";

import userDal from "@/dal/user.dal";
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

export async function redirectUserOrSendOtpAction(
  _previousState: unknown,
  formData: FormData,
): Promise<
  | { success: false; error: string }
  | { success: true; phoneNumber: string; verified: boolean }
> {
  const result = sendOtpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { success: false, error: result.error.message };
  }

  const phoneNumber = CZECH_PHONE_PREFIX + result.data.phone;

  const users = await userDal.listUsers();

  const user = users.find((user) => user.phoneNumber === phoneNumber);

  if (!user) {
    throw new Error("S tímto telefonním číslem se nelze přihlásit.");
  }

  if (user.phoneNumberVerified) {
    return { success: true, phoneNumber, verified: true };
  }

  await auth.api.sendPhoneNumberOTP({
    body: {
      phoneNumber: phoneNumber,
    },
  });

  return { success: true, phoneNumber, verified: false };
}

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

export async function verifyOtpAction(
  _previousState: unknown,
  formData: FormData,
): Promise<{ success: false; error: string } | { success: true }> {
  const result = verifyOtpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { success: false, error: result.error.message };
  }

  try {
    await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber: result.data.phoneNumber,
        code: result.data.otp,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

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

export async function setPasswordAction(
  _previousState: unknown,
  formData: FormData,
): Promise<
  { success: false; error: string } | { success: true; phoneNumber: string }
> {
  const result = verifySetPasswordSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!result.success) {
    return { success: false, error: result.error.message };
  }

  const userHeaders = await headers();

  try {
    await auth.api.setPassword({
      body: {
        newPassword: result.data.password,
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

    return { success: true, phoneNumber: result.data.phoneNumber };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

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

export async function loginAction(
  _previousState: unknown,
  formData: FormData,
): Promise<{ success: false; error: string } | { success: true }> {
  const result = verifyLoginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { success: false, error: result.error.message };
  }

  try {
    await auth.api.signInPhoneNumber({
      body: {
        phoneNumber: result.data.phoneNumber,
        password: result.data.password,
        rememberMe: true,
      },
    });
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
  redirect("/");
}

// ######################################################################
// #
// #    LOGOUT
// #
// ######################################################################

export async function logoutAction() {
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
}
