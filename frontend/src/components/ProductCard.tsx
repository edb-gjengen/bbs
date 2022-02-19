import clsx from "clsx";
import React, { MouseEventHandler } from "react";

import { Product } from "../types";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Omit<Product, "userCounts">;
  onProduct: MouseEventHandler;
  active: boolean;
  amount: number;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProduct, amount, active = false }) => {
  const classes = clsx(styles.product, { [styles.active]: active });
  return (
    <button className={classes} type="button" onClick={onProduct}>
      <div className={styles.wrap}>
        <span className={styles.amount}>{amount}</span>
        {product.imageUrl && <img src={product.imageUrl} className={styles.productImage} alt={product.name} />}
        {!product.imageUrl && <div className={styles.noProductImage} />}
        <span className={styles.productText}>{product.name}</span>
      </div>
    </button>
  );
};
