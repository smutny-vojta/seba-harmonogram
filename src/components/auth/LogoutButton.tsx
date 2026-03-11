"use client";

import { logoutAction } from "@/actions/auth";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logoutAction();
  };

  return <button onClick={handleLogout}>Odhlásit se</button>;
}
