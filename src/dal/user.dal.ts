import { db } from "@/lib/db";

const userDal = {
  listUsers: async () => {
    return await db.query.user.findMany();
  },
};

export default userDal;
