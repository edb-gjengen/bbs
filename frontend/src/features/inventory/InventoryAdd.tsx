import { useMutation, useQuery } from "@apollo/client/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./Inventory.module.css";
import { GQLError } from "../../components/GQLError";
import { useToast } from "../../hooks/useToast";
import { CreateInventoryTransactionDocument, InventoryProductsDocument } from "../../types";

const LOGIN_URL = `${import.meta.env.VITE_API_URL}/accounts/login/?next=/inventory/add`;

const InventoryAdd = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data, loading, error } = useQuery(InventoryProductsDocument);
  const [createInventoryTransaction, { loading: saving }] = useMutation(CreateInventoryTransactionDocument);
  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [comment, setComment] = useState("");
  const products = data?.allProducts || [];

  if (loading) return <div>Loading...</div>;
  if (error) return <GQLError error={error} />;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await createInventoryTransaction({
        variables: {
          data: {
            productId,
            amount: Number(amount),
            unitPrice,
            comment,
          },
        },
      });
      const response = result.data?.createInventoryTransaction;
      if (response?.__typename === "CreateInventoryTransactionSuccess") {
        showToast(`Registrerte ${amount} stk ${response.inventoryTransaction.product.name}.`);
        navigate("/inventory");
      } else if (response?.__typename === "FormErrors") {
        showToast(response.message, "danger");
      } else {
        showToast("Kunne ikke registrere varetransaksjonen.", "danger");
      }
    } catch (mutationError) {
      showToast(
        mutationError instanceof Error ? mutationError.message : "Kunne ikke registrere varetransaksjonen.",
        "danger",
      );
    }
  };

  return (
    <div>
      <h2>Registrer varetransaksjon</h2>
      <p>
        Du må være innlogget for å registrere varer. <a href={LOGIN_URL}>Logg inn</a>.
      </p>
      <form className={styles.form} onSubmit={onSubmit}>
        <label>
          Vare
          <select required value={productId} onChange={(event) => setProductId(event.target.value)}>
            <option value="">Velg vare</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.inventoryAmount} på lager)
              </option>
            ))}
          </select>
        </label>
        <label>
          Antall
          <input required type="number" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <label>
          Innkjøpspris per enhet (kr)
          <input
            required
            step="0.1"
            type="number"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
          />
        </label>
        <label>
          Kommentar
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} />
        </label>
        <div className={styles.summary}>
          <button type="submit" className="primary" disabled={saving || !products.length}>
            {saving ? "Lagrer..." : "Registrer"}
          </button>
          <Link to="/inventory">Avbryt</Link>
        </div>
      </form>
      {!products.length && <p>Ingen aktive varer å registrere.</p>}
    </div>
  );
};

export default InventoryAdd;
