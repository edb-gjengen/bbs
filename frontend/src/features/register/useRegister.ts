import { useQuery } from "@apollo/client";
import { parseISO, subDays } from "date-fns";
import { useState } from "react";

import { User, Product, AllProductsDocument, AllUsersDocument } from "../../types";

const activeLimitDays = 365 / 2;

type useRegisterType = {
  users: User[];
  products: Omit<Product, "userCounts">[];
  loading: boolean;
  showAll: boolean;
  setShowAll: CallableFunction;
};

export const useRegister = (): useRegisterType => {
  const [showAll, setShowAll] = useState(false);
  const { data, loading } = useQuery(AllProductsDocument, { variables: { active: true } });
  const { data: usersData, loading: usersLoading } = useQuery(AllUsersDocument);

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
