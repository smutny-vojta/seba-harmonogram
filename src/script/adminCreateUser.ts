import { createUser } from "@/service/user.service";

(async () => {
  const createdUser = await createUser({
    name: "Vojtěch Smutný",
    phoneNumber: "+420123456789",
    role: "headManager",
  });

  console.log(createdUser);
})();
