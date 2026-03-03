import * as auth from "./auth";
import * as camp from "./camp";
import * as assignment from "./assignment";
import * as schedule from "./schedule";
import * as meal from "./meal";
import * as message from "./message";

export * from "./auth";
export * from "./camp";
export * from "./assignment";
export * from "./schedule";
export * from "./meal";
export * from "./message";

export const schema = {
  ...auth,
  ...camp,
  ...assignment,
  ...schedule,
  ...meal,
  ...message,
};
