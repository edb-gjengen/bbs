import { useQuery } from "@apollo/client";
import React from "react";

import { Order, OrderLine, OrderListDocument, Transaction, TransactionListDocument } from "../../types";
import styles from "./Log.module.css";

export const Log = () => {
  const { data: ordersData, loading: ordersLoading } = useQuery(OrderListDocument);
  const { data: transactionsData, loading: transactionsLoading } = useQuery(TransactionListDocument);
  const loading = ordersLoading || transactionsLoading;

  if (loading) return <div>Loading...</div>;

  const { orderList: orders } = ordersData;
  const { transactionList: transactions } = transactionsData;

  return (
    <div className={styles.log}>
      <div>
        <h2>Ordre</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Når</th>
              <th scope="col">Hvem</th>
              <th scope="col">Hva</th>
              <th scope="col">Sum</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
              <tr key={order.id}>
                <td>{order.created}</td>
                <td>{order.isExternal ? "Ekstern" : `${order.customer?.firstName} ${order.customer?.lastName}`}</td>
                <td>
                  {(order.orderlines ?? []).map((line: OrderLine) => (
                    <div key={line.id}>
                      {line.amount}x {line.product.name}
                    </div>
                  ))}
                </td>
                <td>{order.orderSum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Transaksjoner</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Når</th>
              <th scope="col">Hvem</th>
              <th scope="col">Innskudd</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trans: Transaction) => (
              <tr key={trans.id}>
                <td>{trans.created}</td>
                <td>
                  {trans.user.firstName} {trans.user.lastName}
                </td>
                <td>{trans.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
