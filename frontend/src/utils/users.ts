import { parseISO, subDays } from "date-fns";

import type { User } from "../types";

const activeLimitDays = 365 / 2;

export const activeUserFilter = (user: User) => {
  const balance = user.profile?.balance || 0;
  const active = parseISO(user.profile?.lastPurchaseDate) >= subDays(new Date(), activeLimitDays);
  return balance >= 15 && active;
};
