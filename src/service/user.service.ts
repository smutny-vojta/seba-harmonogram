import { auth } from "@/lib/auth";
import { ROLES } from "@/lib/consts";

export async function createUser({
  phoneNumber,
  name,
  role = ROLES.STRINGS[0],
}: {
  phoneNumber: string;
  name: string;
  role?: (typeof ROLES.STRINGS)[number];
}) {
  const newUser = await auth.api.createUser({
    body: {
      email: `${phoneNumber}@ckrobinson.cz`,
      password: undefined,
      name: name,
      role: role,
      data: { phoneNumber },
    },
  });

  return newUser;
}
