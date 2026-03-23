"use client";

import { useTransition } from "react";
// import { logoutAction } from "../actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      // onClick={() => startTransition(() => { logoutAction(); })}
      disabled={isPending}
    >
      {isPending ? "Odhlašování..." : "Odhlásit se"}
    </button>
  );
}
