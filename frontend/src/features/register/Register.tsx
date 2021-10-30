import React from "react";

import { Product, User } from "../../types";
import styles from "./Register.module.css";
import { useRegister } from "./useRegister";

export const Register: React.FC = () => {
  const { users, products, loading, showAll, setShowAll } = useRegister();
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <section>
        <h2>Hvem kjøper?</h2>
        <div key="external">Ekstern</div>
        {users.map((user: User) => {
          return <div key={user.id}>{user.firstName}</div>;
        })}
        <button type="button" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Skjul gamliser" : "Vis alle"}
        </button>
      </section>
      <section>
        <h2>Kjøper hva?</h2>
        <div className={styles.productList}>
          {products.map((product: Product) => {
            return (
              <div key={product.id} className={styles.product}>
                {product.imageUrl && <img src={product.imageUrl} className={styles.productImage} alt={product.name} />}
                <span className={styles.productText}>{product.name}</span>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        Totalt: 0
        <button type="button" onClick={() => console.log("kjøp")}>
          Kjøp
        </button>
        <button type="button" onClick={() => console.log("reset")}>
          Start på nytt
        </button>
      </section>
    </div>
  );
};
