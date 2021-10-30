import React from "react";

import { Product, User } from "../types";
import { useRegister } from "./useRegister";

export const Register: React.FC = () => {
  const { users, products, loading, showAll, setShowAll } = useRegister();
  if (loading) {
    return <div>...</div>;
  }
  return (
    <div>
      <section>
        {users.map((user: User) => {
          return <div key={user.id}>{user.firstName}</div>;
        })}
      </section>
      <section>
        {products.map((product: Product) => {
          return <div key={product.id}>{product.name}</div>;
        })}
      </section>
    </div>
  );
};
