import { createSafeActionClient } from "next-safe-action";

// !TODO: upravit a pridat veci podle docs (https://next-safe-action.dev/docs/quick-start)

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e);
    if (e instanceof Error) {
      return e.message;
    }
    return "Nastala neočekávaná chyba při zpracování požadavku.";
  },
});
