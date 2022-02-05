import { useQuery } from "@apollo/client";
import clsx from "clsx";
import { parseISO, format } from "date-fns";
import React from "react";
import { useUrlSearchParams } from "use-url-search-params";

import { Order, OrderLine, OrderListDocument, Transaction, TransactionListDocument } from "../../types";
import styles from "./Log.module.css";

const formatTime = (isoDateTime: string): string => format(parseISO(isoDateTime), "yyyy-MM-dd HH:mm");

const PAGE_SIZE = 10;

export const Log = () => {
  const types = {
    orderOffset: Number,
    transactionOffset: Number,
  };
  const [params, setParams] = useUrlSearchParams({}, types);
  const { data: ordersData, loading: ordersLoading } = useQuery(OrderListDocument, {
    variables: { offset: params.orderOffset },
  });
  const { data: transactionsData, loading: transactionsLoading } = useQuery(TransactionListDocument, {
    variables: { offset: params.transactionOffset },
  });
  const loading = ordersLoading || transactionsLoading;

  const orderOffset = params.orderOffset || 0;
  const transactionOffset = params.transactionOffset || 0;

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
                <td>{formatTime(order.created)}</td>
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
        <nav aria-label="Order pagination">
          <ul className="pagination">
            <li className={clsx("page-item", { disabled: orderOffset <= 0 })}>
              <a
                className="page-link"
                onClick={() => {
                  setParams({ orderOffset: orderOffset - PAGE_SIZE });
                }}
              >
                Previous
              </a>
            </li>
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => {
                  setParams({ orderOffset: orderOffset + PAGE_SIZE });
                }}
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
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
          <ul className="pagination">
            <li className={clsx("page-item", { disabled: transactionOffset <= 0 })}>
              <a
                className="page-link"
                onClick={() => {
                  setParams({ transactionOffset: transactionOffset - PAGE_SIZE });
                }}
              >
                Previous
              </a>
            </li>
            <li className="page-item">
              <a
                className="page-link"
                onClick={() => {
                  setParams({ transactionOffset: transactionOffset + PAGE_SIZE });
                }}
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
