"use client";

import { useAction } from "next-safe-action/hooks";
import { logoutAction } from "@/actions/auth";

export default function LogoutButton() {
  const { execute, isExecuting } = useAction(logoutAction);

  return (
    <button onClick={() => execute()} disabled={isExecuting}>
      {isExecuting ? "Odhlašování..." : "Odhlásit se"}
    </button>
  );
}
