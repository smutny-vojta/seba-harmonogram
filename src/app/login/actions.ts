"use server";

import userDal from "@/dal/user.dal";
import { auth } from "@/lib/auth";
import { CZECH_PHONE_REGEX, CZECH_PHONE_PREFIX } from "@/lib/consts";
import { z } from "zod/v4";

const sendOtpSchema = z.object({
  phone: z
    .string()
    .regex(CZECH_PHONE_REGEX, "Telefonní číslo musí mít 9 číslic"),
});

export async function sendOtp(_previousState: unknown, formData: FormData) {
  const result = sendOtpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: z.treeifyError(result.error) };
  }

  const phoneNumber = CZECH_PHONE_PREFIX + result.data.phone;

  const users = await userDal.listUsers();

  const user = users.find((user) => user.phoneNumber === phoneNumber);

  if (!user) {
    throw new Error("S tímto telefonním číslem se nelze přihlásit.");
  }

  const data = await auth.api.sendPhoneNumberOTP({
    body: {
      phoneNumber: phoneNumber,
    },
  });

  console.log(data);

  return { phoneNumber };
}
