import { auth } from "@/lib/auth";

export async function createUser(phoneNumber: string, name: string) {
  const newUser = await auth.api.createUser({
    body: {
      email: `${phoneNumber}@ckrobinson.cz`,
      password: undefined,
      name: name,
      role: "instructor",
      data: { phoneNumber },
    },
  });

  return newUser;
}
