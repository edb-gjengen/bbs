import { useQuery } from "@apollo/client";
import clsx from "clsx";
import React from "react";
import { useUrlSearchParams } from "use-url-search-params";

import { OrderListDocument, TransactionListDocument } from "../../types";
import { formatTime } from "../../utils/time";
import styles from "./Log.module.css";

const PAGE_SIZE = 10;

export const Log = () => {
  const types = {
    orderOffset: Number,
    transactionOffset: Number,
  };
  const [params, setParams] = useUrlSearchParams({}, types);
  const orderOffset = Number(params.orderOffset) || 0;
  const transactionOffset = Number(params.transactionOffset) || 0;
  const { data: ordersData, loading: ordersLoading } = useQuery(OrderListDocument, {
    variables: { offset: orderOffset },
  });
  const { data: transactionsData, loading: transactionsLoading } = useQuery(TransactionListDocument, {
    variables: { offset: transactionOffset },
  });
  const loading = ordersLoading || transactionsLoading;

  if (loading) return <div>Loading...</div>;

  const orders = ordersData?.orderList || [];
  const transactions = transactionsData?.transactionList || [];

  return (
    <div className={styles.log}>
      <div>
        <h2>Ordre</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Når</th>
              <th scope="col">Hvem</th>
              <th scope="col">Hva</th>
              <th scope="col">Sum</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{formatTime(order.created)}</td>
                <td>{order.isExternal ? "Ekstern" : `${order.customer?.firstName} ${order.customer?.lastName}`}</td>
                <td>
                  {(order.orderlines ?? []).map((line) => (
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
        <nav aria-label="Order pagination">
          <ul className={styles.pagination}>
            <li className={clsx({ [styles.disabled]: orderOffset <= 0 })}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setParams({ orderOffset: Math.max(0, orderOffset - PAGE_SIZE) });
                }}
              >
                ⬅
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setParams({ orderOffset: Math.max(0, orderOffset + PAGE_SIZE) });
                }}
              >
                ➡
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <h2>Transaksjoner</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Når</th>
              <th scope="col">Hvem</th>
              <th scope="col">Innskudd</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trans) => (
              <tr key={trans.id}>
                <td>{formatTime(trans.created)}</td>
                <td>
                  {trans.user.firstName} {trans.user.lastName}
                </td>
                <td>{trans.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav aria-label="Transaction pagination">
          <ul className={styles.pagination}>
            <li className={clsx({ [styles.disabled]: transactionOffset <= 0 })}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setParams({ transactionOffset: Math.max(0, transactionOffset - PAGE_SIZE) });
                }}
              >
                ⬅
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setParams({ transactionOffset: Math.max(transactionOffset + PAGE_SIZE) });
                }}
              >
                ➡
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
