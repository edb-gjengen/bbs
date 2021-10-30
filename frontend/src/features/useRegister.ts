import { parseISO, subDays } from "date-fns";
import { useState } from "react";

import { useAllProductsQuery, useAllUsersQuery, User } from "../types";

const activeLimitDays = 365 / 2;

export const useRegister = () => {
  const [showAll, setShowAll] = useState(false);
  const { data, loading } = useAllProductsQuery({ variables: { active: true } });
  const { data: usersData, loading: usersLoading } = useAllUsersQuery();

  const allUsers = usersData?.allUsers || [];
  const users = showAll
    ? allUsers
    : allUsers.filter((user: User) => {
        const balance = user.profile?.balance || 0;
        const active = parseISO(user.profile?.lastPurchaseDate) >= subDays(new Date(), activeLimitDays);
        return balance >= 15 && active;
      });

  return { loading: loading || usersLoading, users, products: data?.allProducts || [], showAll, setShowAll };
};
