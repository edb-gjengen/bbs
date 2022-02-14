import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

import { useToast } from "../../components/ToastProvider";
import { AllUsersDocument, CreateDepositDocument } from "../../types";

export const useDeposit = () => {
  const { data, loading } = useQuery(AllUsersDocument);
  const [createDeposit] = useMutation(CreateDepositDocument);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const filteredUsers = (data?.allUsers || []).filter((user) =>
    `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`.includes(userQuery.toLowerCase())
  );
  const { showToast } = useToast();

  const onSubmit = async () => {
    const amountInt = parseInt(amount, 10) || 0;
    const variables = { userId: selectedUser, amount: amountInt };
    let res;
    try {
      res = await createDeposit({ variables });
    } catch (e) {
      console.log("woops", e);
      showToast("Kunne ikke sette inn penger", "danger");
      return;
    }

    if (res.data?.createDeposit?.__typename === "CreateDepositSuccess") {
      const { transaction } = res.data?.createDeposit;
      showToast(
        `${transaction.user.firstName} har satt inn${transaction.amount}. Ny saldo er ${transaction.user.profile?.balance}.`
      );
      reset();
      return;
    }
    if (res.data?.createDeposit?.__typename === "FormErrors") {
      showToast(res.data?.createDeposit.message, "danger");
      return;
    }
    if (res.data?.createDeposit?.__typename === "AboveMaxSaldo") {
      showToast(
        `${res.data.createDeposit.message}. Ny saldo ville vært ${res.data.createDeposit.above} mer enn maksimalt ${res.data.createDeposit.maxSaldo}.`,
        "danger"
      );
    }
  };
  const reset = () => {
    setSelectedUser("");
    setAmount("");
    setUserQuery("");
  };

  return {
    loading,
    selectedUser,
    setSelectedUser,
    amount,
    setAmount,
    userQuery,
    setUserQuery,
    filteredUsers,
    reset,
    onSubmit,
  };
};
