import React, { useState } from "react";

import { ProductCard } from "../../components/ProductCard";
import { UserCard } from "../../components/UserCard";
import { Product, User } from "../../types";
import styles from "./Register.module.css";
import { useRegister } from "./useRegister";

const USER_EXTERNAL = "external";

type OrderLine = {
  id: string;
  amount: number;
};

const sumTotal = (products: Product[], order: OrderLine[], isExternal: boolean) => {
  const prices = order.map((orderLine: OrderLine) => {
    const product = products.find((product: Product) => product.id === orderLine.id);
    if (!product) return 0;
    return orderLine.amount * (isExternal ? product.salePriceExt : product.salePriceInt);
  });
  return prices.reduce((partialSum, a) => partialSum + a, 0);
};

export const Register: React.FC = () => {
  const { users, products, loading, showAll, setShowAll } = useRegister();
  const [selectedUser, setSelectedUser] = useState("");
  const [order, setOrder] = useState<OrderLine[]>([]);

  const reset = () => {
    setOrder([]);
    setSelectedUser("");
  };
  const addToOrder = (id: string) => {
    let added = false;
    const newOrder = order.map((orderLine: OrderLine) => {
      if (orderLine.id === id) {
        added = true;
        return { ...orderLine, amount: orderLine.amount + 1 };
      }
      return orderLine;
    });
    if (!added) {
      newOrder.push({ id, amount: 1 });
    }
    setOrder(newOrder);
  };

  const total = sumTotal(products, order, selectedUser === USER_EXTERNAL);

  console.log(selectedUser, order);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section>
        <h2>Hvem kjøper?</h2>
        <div className={styles.userList}>
          <UserCard
            key={USER_EXTERNAL}
            user={null}
            onUser={() => setSelectedUser(USER_EXTERNAL)}
            active={selectedUser == USER_EXTERNAL}
          />
          {users.map((user: User) => (
            <UserCard
              key={user.id}
              user={user}
              onUser={() => setSelectedUser(user.id)}
              active={selectedUser == user.id}
            />
          ))}
        </div>
        <button type="button" className="btn btn-link" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Skjul gamliser" : "Vis alle"}
        </button>
      </section>
      <section className={styles.productListSection}>
        <h2>Kjøper hva?</h2>
        <div className={styles.productList}>
          {products.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProduct={() => addToOrder(product.id)}
              amount={order.find((orderLine: OrderLine) => orderLine.id === product.id)?.amount || 0}
              active={order.some((orderLine: OrderLine) => orderLine.id === product.id)}
            />
          ))}
        </div>
      </section>
      <section className={styles.checkout}>
        <span className={styles.total}>
          Totalt: <span>{total}</span>
        </span>
        <button type="button" className="btn btn-primary btn-lg" onClick={() => console.log("kjøp", order)}>
          Kjøp
        </button>{" "}
        <button type="button" className="btn btn-outline-secondary" onClick={reset}>
          Start på nytt
        </button>
      </section>
    </div>
  );
};
