import { useMutation } from "@apollo/client";
import React, { useState } from "react";

import { ProductCard } from "../../components/ProductCard";
import { useToast } from "../../components/ToastProvider";
import { UserCard } from "../../components/UserCard";
import { CreateOrderDocument, Product, User } from "../../types";
import styles from "./Register.module.css";
import { useRegister } from "./useRegister";

const USER_EXTERNAL = "external";

type OrderLineInput = {
  productId: string;
  amount: number;
};

const sumTotal = (products: Omit<Product, "userCounts">[], order: OrderLineInput[], isExternal: boolean) => {
  const prices = order.map((orderLine: OrderLineInput) => {
    const product = products.find((product: Omit<Product, "userCounts">) => product.id === orderLine.productId);
    if (!product) return 0;
    return orderLine.amount * (isExternal ? product.salePriceExt : product.salePriceInt);
  });
  return prices.reduce((partialSum, a) => partialSum + a, 0);
};

export const Register: React.FC = () => {
  const { users, products, loading, showAll, setShowAll } = useRegister();
  const [selectedUser, setSelectedUser] = useState("");
  const [order, setOrder] = useState<OrderLineInput[]>([]);
  const [createOrderMutation, { loading: mutateLoading }] = useMutation(CreateOrderDocument, {
    variables: { customerId: selectedUser, isExternal: selectedUser === USER_EXTERNAL, orderLines: order },
  });
  const { showToast } = useToast();

  const reset = () => {
    setOrder([]);
    setSelectedUser("");
  };
  const addToOrder = (productId: string) => {
    let added = false;
    const newOrder = order.map((orderLine: OrderLineInput) => {
      if (orderLine.productId === productId) {
        added = true;
        return { ...orderLine, amount: orderLine.amount + 1 };
      }
      return orderLine;
    });
    if (!added) {
      newOrder.push({ productId, amount: 1 });
    }
    setOrder(newOrder);
  };

  const total = sumTotal(products, order, selectedUser === USER_EXTERNAL);

  if (loading) {
    return <div>Loading...</div>;
  }

  const onSubmit = async () => {
    let res;
    try {
      res = await createOrderMutation();
    } catch (e) {
      showToast("Whoops");
      console.log("woops");
      return;
    }
    const { data } = res;
    const createOrderResponse = data?.createOrder;
    if (createOrderResponse?.__typename === "CreateOrderSuccess") {
      const { order } = createOrderResponse;
      const orderLines = (order?.orderlines || [])
        .map((orderLine) => `${orderLine.amount} ${orderLine.product.name}`)
        .join(", ");
      const who = !order.customer ? "Ekstern" : `${order.customer?.firstName} ${order.customer?.lastName}`;
      showToast(`${who} kjøpte: ${orderLines}`);
      reset();
      return;
    }

    if (createOrderResponse?.__typename === "FormErrors") {
      showToast(createOrderResponse.message, "danger");
      return;
    }

    if (createOrderResponse?.__typename === "InsufficientFunds") {
      showToast(`${createOrderResponse.message} Du mangler ${createOrderResponse.amountLacking},-`, "danger");
    }
  };
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
