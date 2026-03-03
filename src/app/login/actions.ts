"use server";

import { auth } from "@/lib/auth";

export async function sendOtpCode(_previousState: unknown, formData: FormData) {
  const phoneNumber = formData.get("phone") as string;
  const phoneRegex = /^\d{9}$/;

  if (!phoneNumber) {
    throw new Error("Chybí telefonní číslo");
  }

  if (!phoneRegex.test(phoneNumber)) {
    throw new Error("Neplatné telefonní číslo");
  }

  const data = await auth.api.sendPhoneNumberOTP({
    body: {
      phoneNumber: `+420${phoneNumber}`,
    },
  });

  console.log(data);

  return { phoneNumber };
}
