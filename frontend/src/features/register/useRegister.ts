import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

import { useToast } from "../../components/ToastProvider";
import {
  AllProductsDocument,
  AllProductsQuery,
  AllUsersDocument,
  CreateOrderDocument,
  OrderLineInput,
} from "../../types";
import { formatCurrency } from "../../utils/currency";
import { activeUserFilter } from "../../utils/users";

const USER_EXTERNAL = "external";

type Product = AllProductsQuery["allProducts"][number];

const sumTotal = (products: Product[], order: OrderLineInput[], isExternal: boolean) => {
  const prices = order.map((orderLine: OrderLineInput) => {
    const product = products.find((product) => product.id === orderLine.productId);
    if (!product) return 0;
    return orderLine.amount * Number(isExternal ? product.salePriceExt : product.salePriceInt);
  });
  return prices.reduce((partialSum, a) => partialSum + a, 0);
};

export const useRegister = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [order, setOrder] = useState<OrderLineInput[]>([]);
  const { showToast } = useToast();

  const { data, loading } = useQuery(AllProductsDocument, { variables: { active: true } });
  const products = data?.allProducts || [];

  const { data: usersData, loading: usersLoading } = useQuery(AllUsersDocument);
  const allUsers = usersData?.allUsers || [];
  const users = showAll ? allUsers : allUsers.filter(activeUserFilter);

  const [createOrderMutation] = useMutation(CreateOrderDocument, {
    variables: { customerId: selectedUser, isExternal: selectedUser === USER_EXTERNAL, orderLines: order },
  });

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

  const total = formatCurrency(sumTotal(products, order, selectedUser === USER_EXTERNAL));

  const onSubmit = async () => {
    let res;
    try {
      res = await createOrderMutation();
    } catch {
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
  return {
    loading: loading || usersLoading,
    users,
    products,
    showAll,
    setShowAll,
    setSelectedUser,
    selectedUser,
    addToOrder,
    order,
    total,
    onSubmit,
    reset,
  };
};
