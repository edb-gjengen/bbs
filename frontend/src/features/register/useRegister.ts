import { useQuery } from "@apollo/client";
import { useState } from "react";

import { User, Product, AllProductsDocument, AllUsersDocument } from "../../types";
import { activeUserFilter } from "../../utils/users";

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
  const users = showAll ? allUsers : allUsers.filter(activeUserFilter);

  return { loading: loading || usersLoading, users, products: data?.allProducts || [], showAll, setShowAll };
};
