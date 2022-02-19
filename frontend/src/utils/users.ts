import { parseISO, subDays } from "date-fns";

import { AllUsersQuery } from "../types";

const activeLimitDays = 365 / 2;

type FilterableUser = AllUsersQuery["allUsers"][0];

export const activeUserFilter = (user: FilterableUser) => {
  const balance = user.profile?.balance || 0;
  const active = parseISO(user.profile?.lastPurchaseDate) >= subDays(new Date(), activeLimitDays);
  return balance >= 15 && active;
};
