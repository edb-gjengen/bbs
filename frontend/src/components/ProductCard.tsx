import clsx from "clsx";
import React, { MouseEventHandler } from "react";

import { Product } from "../types";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Product;
  onProduct: MouseEventHandler;
  active: boolean;
  amount: number;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProduct, amount, active = false }) => {
  const classes = clsx(styles.product, { [styles.active]: active });
  return (
    <button className={classes} type="button" onClick={onProduct}>
      <span>{amount}</span>
      {product.imageUrl && <img src={product.imageUrl} className={styles.productImage} alt={product.name} />}
      <span className={styles.productText}>{product.name}</span>
    </button>
  );
};
