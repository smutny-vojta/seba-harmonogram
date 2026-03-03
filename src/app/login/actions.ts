"use server";

import userDal from "@/dal/user.dal";
import { auth } from "@/lib/auth";

export async function sendOtpCode(_previousState: unknown, formData: FormData) {
  const formPhoneNumber = formData.get("phone") as string;
  const phoneRegex = /^\+420\d{9}$/;

  const phoneNumber = "+420" + formPhoneNumber;

  if (!phoneNumber) {
    throw new Error("Chybí telefonní číslo");
  }

  if (!phoneRegex.test(phoneNumber)) {
    throw new Error("Neplatné telefonní číslo");
  }

  const data = await auth.api.sendPhoneNumberOTP({
    body: {
      phoneNumber: phoneNumber,
    },
  });

  const users = await userDal.listUsers();

  const user = users.find((user) => user.phoneNumber === phoneNumber);

  if (!user) {
    throw new Error("Uživatel nenalezen");
  }

  console.log(data);

  return { phoneNumber };
}
