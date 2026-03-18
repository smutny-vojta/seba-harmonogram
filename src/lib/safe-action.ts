import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e);
    if (e instanceof Error) {
      return e.message;
    }
    return "Nastala neočekávaná chyba při zpracování požadavku.";
  },
});
