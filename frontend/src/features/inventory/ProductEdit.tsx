import { useMutation, useQuery } from "@apollo/client/react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import styles from "./Inventory.module.css";
import { GQLError } from "../../components/GQLError";
import { useToast } from "../../hooks/useToast";
import {
  CreateProductDocument,
  ProductFormDocument,
  ProductFormQuery,
  ProductInput,
  UpdateProductDocument,
  ViewerDocument,
} from "../../types";
import { loginUrl } from "../../utils/api";

type FormValues = {
  name: string;
  salePriceInt: string;
  salePriceExt: string;
  volumeLiter: string;
  alcoholPercent: string;
  description: string;
  active: boolean;
};

const emptyValues: FormValues = {
  name: "",
  salePriceInt: "",
  salePriceExt: "",
  volumeLiter: "",
  alcoholPercent: "",
  description: "",
  active: true,
};

const toFormValues = (product: ProductFormQuery["product"]): FormValues => ({
  name: product.name,
  salePriceInt: product.salePriceInt,
  salePriceExt: product.salePriceExt,
  volumeLiter: product.volumeLiter ?? "",
  alcoholPercent: product.alcoholPercent ?? "",
  description: product.description,
  active: product.active,
});

const toInput = (values: FormValues): ProductInput => ({
  ...values,
  volumeLiter: values.volumeLiter || null,
  alcoholPercent: values.alcoholPercent || null,
});

// Keyed by the API's field names, e.g. sale_price_int
type FieldErrors = Record<string, string>;

const FieldError = ({ errors, field }: { errors: FieldErrors; field: string }) =>
  errors[field] ? <span className={styles.error}>{errors[field]}</span> : null;

const ProductForm = ({ productId, initialValues }: { productId?: string; initialValues: FormValues }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [createProduct, { loading: creating }] = useMutation(CreateProductDocument, {
    // The product lists don't know about the new product; have them load again
    update: (cache) => {
      cache.evict({ id: "ROOT_QUERY", fieldName: "allProducts" });
      cache.gc();
    },
  });
  const [updateProduct, { loading: updating }] = useMutation(UpdateProductDocument);
  const saving = creating || updating;

  const set =
    (field: Exclude<keyof FormValues, "active">) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues({ ...values, [field]: event.target.value });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = toInput(values);
    try {
      const response = productId
        ? (await updateProduct({ variables: { productId, data } })).data?.updateProduct
        : (await createProduct({ variables: { data } })).data?.createProduct;
      if (response?.__typename === "SaveProductSuccess") {
        showToast(`Lagret ${response.product.name}.`);
        navigate("/inventory");
      } else if (response?.__typename === "FormErrors") {
        setFieldErrors(Object.fromEntries(response.fields.map(({ field, message }) => [field, message])));
        showToast(response.message, "danger");
      } else {
        showToast("Kunne ikke lagre varen.", "danger");
      }
    } catch (mutationError) {
      showToast(mutationError instanceof Error ? mutationError.message : "Kunne ikke lagre varen.", "danger");
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label>
        Navn
        <input required maxLength={64} value={values.name} onChange={set("name")} />
        <FieldError errors={fieldErrors} field="name" />
      </label>
      <label>
        Pris internt (kr)
        <input required type="number" min="0" step="0.1" value={values.salePriceInt} onChange={set("salePriceInt")} />
        <FieldError errors={fieldErrors} field="sale_price_int" />
      </label>
      <label>
        Pris eksternt (kr)
        <input required type="number" min="0" step="0.1" value={values.salePriceExt} onChange={set("salePriceExt")} />
        <FieldError errors={fieldErrors} field="sale_price_ext" />
      </label>
      <label>
        Volum (liter)
        <input required type="number" min="0" step="0.1" value={values.volumeLiter} onChange={set("volumeLiter")} />
        <FieldError errors={fieldErrors} field="volume_liter" />
      </label>
      <label>
        Alkohol (%)
        <input
          required
          type="number"
          min="0"
          step="0.1"
          value={values.alcoholPercent}
          onChange={set("alcoholPercent")}
        />
        <FieldError errors={fieldErrors} field="alcohol_percent" />
      </label>
      <label>
        Beskrivelse
        <textarea maxLength={256} value={values.description} onChange={set("description")} />
        <FieldError errors={fieldErrors} field="description" />
      </label>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={values.active}
          onChange={(event) => setValues({ ...values, active: event.target.checked })}
        />
        I salg
      </label>
      <div className={styles.summary}>
        <button type="submit" className="primary" disabled={saving}>
          {saving ? "Lagrer..." : "Lagre"}
        </button>
        <Link to="/inventory">Avbryt</Link>
      </div>
    </form>
  );
};

// Adds a product, or edits one at /inventory/products/:productId. Needs the same access as the Django admin.
const ProductEdit = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { data: viewerData, loading: viewerLoading, error: viewerError } = useQuery(ViewerDocument);
  const { data, loading, error } = useQuery(ProductFormDocument, {
    variables: { productId: productId ?? "" },
    skip: !productId,
  });
  // Logged out: log in, and Django sends the browser back here afterwards
  const loggedOut = !!viewerData && !viewerData.me;
  const login = loginUrl(location.pathname);
  useEffect(() => {
    if (loggedOut) window.location.replace(login);
  }, [loggedOut, login]);

  if (viewerLoading || loading) return <div>Loading...</div>;
  if (viewerError || error) return <GQLError error={(viewerError || error)!} />;

  const viewer = viewerData?.me;
  const title = productId ? `Rediger ${data?.product.name ?? "vare"}` : "Ny vare";
  const hasAccess = productId ? viewer?.canChangeProducts : viewer?.canAddProducts;

  return (
    <div>
      <h2>{title}</h2>
      {!viewer && (
        <p>
          Sender deg til innlogging… Skjer det ingenting, <a href={login}>logg inn her</a>.
        </p>
      )}
      {viewer && !hasAccess && (
        <p>Du har ikke tilgang til å endre varer. Be en administrator om tilgang til varer i adminpanelet.</p>
      )}
      {hasAccess && (
        <>
          <p>Beholdningen endres med varetransaksjoner, og bildet i adminpanelet.</p>
          <ProductForm
            key={productId ?? "new"}
            productId={productId}
            initialValues={data ? toFormValues(data.product) : emptyValues}
          />
        </>
      )}
    </div>
  );
};

export default ProductEdit;
