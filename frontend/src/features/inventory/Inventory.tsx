import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { GQLError } from "../../components/GQLError";
import { InventoryPageDocument } from "../../types";
import { formatCurrency } from "../../utils/currency";
import { formatTime } from "../../utils/time";
import styles from "./Inventory.module.css";

const PAGE_SIZE = 20;

const Inventory = () => {
  const [offset, setOffset] = useState(0);
  const { data, loading, error } = useQuery(InventoryPageDocument, {
    variables: { limit: PAGE_SIZE, offset },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <GQLError error={error} />;

  const products = [...(data?.allProducts || [])].sort(
    (a, b) =>
      Number(b.active) - Number(a.active) || a.inventoryAmount - b.inventoryAmount || a.name.localeCompare(b.name),
  );
  const activeProducts = products.filter((product) => product.active);
  const transactions = data?.inventoryTransactionList || [];

  return (
    <div>
      <h2>Varebeholdning</h2>
      <div className={styles.summary}>
        <div>Antall aktive varer: {activeProducts.reduce((total, product) => total + product.inventoryAmount, 0)}</div>
        <div>
          Innkjøpsverdi:{" "}
          {formatCurrency(activeProducts.reduce((total, product) => total + Number(product.wholesaleValue), 0))} kr
        </div>
      </div>
      <section className={styles.section}>
        <div className={styles.summary}>
          <h3>Varer</h3>
          <Link className="btn-primary" to="/inventory/add">
            Registrer varetransaksjon
          </Link>
          <Link to="/report">Åpne rapport</Link>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th scope="col">Vare</th>
                <th scope="col">Beholdning</th>
                <th scope="col">Innkjøpspris</th>
                <th scope="col">Verdi</th>
                <th scope="col">I salg</th>
                <th scope="col">Sist oppdatert</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className={!product.active ? styles.inactive : undefined}>
                  <td>{product.name}</td>
                  <td>{product.inventoryAmount}</td>
                  <td>{formatCurrency(Number(product.wholesaleUnitPrice))} kr</td>
                  <td>{formatCurrency(Number(product.wholesaleValue))} kr</td>
                  <td>{product.active ? "Ja" : "Nei"}</td>
                  <td>{formatTime(product.updated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className={styles.transactions}>
        <h3>Varetransaksjoner</h3>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th scope="col">Når</th>
                <th scope="col">Vare</th>
                <th scope="col">Antall</th>
                <th scope="col">Enhetspris</th>
                <th scope="col">Hvem</th>
                <th scope="col">Kommentar</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatTime(transaction.created)}</td>
                  <td>{transaction.product.name}</td>
                  <td>{transaction.amount}</td>
                  <td>{formatCurrency(Number(transaction.unitPrice))} kr</td>
                  <td>
                    {transaction.user.firstName} {transaction.user.lastName}
                  </td>
                  <td>{transaction.comment}</td>
                </tr>
              ))}
              {!transactions.length && (
                <tr>
                  <td colSpan={6}>Ingen varetransaksjoner ennå.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <button type="button" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
            Forrige
          </button>
          <button
            type="button"
            disabled={transactions.length < PAGE_SIZE}
            onClick={() => setOffset(offset + PAGE_SIZE)}
          >
            Neste
          </button>
        </div>
      </section>
    </div>
  );
};

export default Inventory;
