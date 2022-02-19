import React from "react";

import { ProductCard } from "../../components/ProductCard";
import { UserCard } from "../../components/UserCard";
import { OrderLineInput, Product } from "../../types";
import styles from "./Register.module.css";
import { useRegister } from "./useRegister";

const USER_EXTERNAL = "external";

export const Register: React.FC = () => {
  const {
    users,
    products,
    loading,
    showAll,
    setShowAll,
    setSelectedUser,
    selectedUser,
    addToOrder,
    order,
    total,
    onSubmit,
    reset,
  } = useRegister();

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
          {users.map((user) => (
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
          {products.map((product: Omit<Product, "userCounts">) => (
            <ProductCard
              key={product.id}
              product={product}
              onProduct={() => addToOrder(product.id)}
              amount={order.find((orderLine: OrderLineInput) => orderLine.productId === product.id)?.amount || 0}
              active={order.some((orderLine: OrderLineInput) => orderLine.productId === product.id)}
            />
          ))}
        </div>
      </section>
      <section className={styles.checkout}>
        <span className={styles.total}>
          Totalt: <span>{total}</span>
        </span>
        <button type="button" className="btn btn-primary btn-lg" onClick={onSubmit}>
          Kjøp
        </button>{" "}
        <button type="button" className="btn btn-outline-secondary btn-lg" onClick={reset}>
          Start på nytt
        </button>
      </section>
    </div>
  );
};
