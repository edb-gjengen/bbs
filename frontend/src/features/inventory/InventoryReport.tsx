import { useQuery } from "@apollo/client/react";
import { format, subDays } from "date-fns";
import React, { useState } from "react";

import styles from "./Inventory.module.css";
import { GQLError } from "../../components/GQLError";
import { InventoryReportDocument } from "../../types";
import { formatCurrency } from "../../utils/currency";

const today = () => format(new Date(), "yyyy-MM-dd");
const monthAgo = () => format(subDays(new Date(), 30), "yyyy-MM-dd");
const timestampAt = (date: string, endOfDay = false) => `${date}T${endOfDay ? "23:59:59.999999" : "00:00:00"}`;

const InventoryReport = () => {
  const [startDate, setStartDate] = useState(monthAgo);
  const [endDate, setEndDate] = useState(today);
  const [appliedRange, setAppliedRange] = useState({ startDate: monthAgo(), endDate: today() });
  const invalidRange = startDate > endDate;
  const { data, loading, error } = useQuery(InventoryReportDocument, {
    variables: {
      startTime: timestampAt(appliedRange.startDate),
      endTime: timestampAt(appliedRange.endDate, true),
    },
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!invalidRange) setAppliedRange({ startDate, endDate });
  };

  if (error) return <GQLError error={error} />;

  const report = data?.inventoryReport;
  const balanceChange = report ? Number(report.balanceAtEnd) - Number(report.balanceAtStart) : 0;
  const inventoryChange = report ? Number(report.inventoryPurchases) - Number(report.productSales) : 0;

  return (
    <div>
      <h2>Varerapport</h2>
      <form className={styles.summary} onSubmit={onSubmit}>
        <label>
          Fra
          <input type="date" required value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label>
          Til
          <input type="date" required value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>
        <button type="submit" disabled={invalidRange}>
          Oppdater
        </button>
      </form>
      {invalidRange && <p className={styles.error}>Startdato må være før eller lik sluttdato.</p>}
      {loading && <div>Loading...</div>}
      {report && (
        <>
          <section className={styles.report}>
            <h3>Beholdningsendring</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Vare</th>
                    <th scope="col">Innkjøp</th>
                    <th scope="col">Salg</th>
                    <th scope="col">Endring verdi</th>
                  </tr>
                </thead>
                <tbody>
                  {report.products.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.productName}</td>
                      <td>
                        {formatCurrency(Number(product.purchaseValue))} kr ({product.purchaseUnits} stk)
                      </td>
                      <td>
                        {formatCurrency(Number(product.salesValue))} kr ({product.salesUnits} stk)
                      </td>
                      <td>{formatCurrency(Number(product.purchaseValue) - Number(product.salesValue))} kr</td>
                    </tr>
                  ))}
                  {!report.products.length && (
                    <tr>
                      <td colSpan={4}>Ingen varetransaksjoner i perioden.</td>
                    </tr>
                  )}
                  <tr>
                    <th scope="row">Totalt</th>
                    <td>{formatCurrency(Number(report.inventoryPurchases))} kr</td>
                    <td>{formatCurrency(Number(report.productSales))} kr</td>
                    <td>{formatCurrency(inventoryChange)} kr</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section className={styles.report}>
            <h3>Innskudd og kjøp</h3>
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Post</th>
                    <th scope="col">Saldo</th>
                    <th scope="col">Innskudd</th>
                    <th scope="col">Kjøp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Saldo ved periodestart</th>
                    <td>{formatCurrency(Number(report.balanceAtStart))} kr</td>
                    <td />
                    <td />
                  </tr>
                  <tr>
                    <th scope="row">Endring i perioden</th>
                    <td>{formatCurrency(balanceChange)} kr</td>
                    <td>{formatCurrency(Number(report.deposits))} kr</td>
                    <td>{formatCurrency(Number(report.orderPurchases))} kr</td>
                  </tr>
                  <tr>
                    <th scope="row">Saldo ved periodeslutt</th>
                    <td>{formatCurrency(Number(report.balanceAtEnd))} kr</td>
                    <td />
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default InventoryReport;
