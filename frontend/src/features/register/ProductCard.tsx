import clsx from "clsx";
import React, { MouseEventHandler } from "react";

import { Product } from "../../types";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Omit<Product, "userCounts">;
  onProduct: MouseEventHandler;
  active: boolean;
  amount: number;
};

export const ProductCard = ({ product, onProduct, amount, active = false }: ProductCardProps): JSX.Element => {
  const classes = clsx(styles.product, { [styles.active]: active });
  return (
    <button className={classes} type="button" onClick={onProduct} title={product.name}>
      <span className={styles.amount}>{amount}</span>
      <span className={styles.productText}>{product.name}</span>
    </button>
  );
};
