import React from "react";

import { OrderLineInput, Product } from "../../types";
import { UserCard } from "../users/UserCard";
import { ProductCard } from "./ProductCard";
import styles from "./Register.module.css";
import { useRegister } from "./useRegister";

const USER_EXTERNAL = "external";

const Register = (): JSX.Element => {
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
        <button type="button" onClick={() => setShowAll(!showAll)} className={styles.showAll}>
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
        <button type="button" onClick={onSubmit} className="primary">
          Kjøp
        </button>{" "}
        <button type="button" onClick={reset}>
          Start på nytt
        </button>
      </section>
    </div>
  );
};
export default Register;
