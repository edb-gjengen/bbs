import { useQuery } from "@apollo/client";
import React from "react";

import { AllUsersDocument } from "../../types";

export const UserCreate = () => {
  const { data, loading } = useQuery(AllUsersDocument);

  if (loading) return <div>Loading...</div>;

  const allUsers = data?.allUsers || [];
  return <div>TODO</div>;
};
