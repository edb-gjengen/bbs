import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";

import { useToast } from "../../components/ToastProvider";
import { UserCard } from "../../components/UserCard";
import { AllUsersDocument, CreateDepositDocument, User } from "../../types";
import styles from "./Deposit.module.css";

export const Deposit: React.FC = () => {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section>
        <h2>Hvem skal sette inn penger?</h2>
        <input
          name="userQuery"
          onChange={(event: React.FormEvent<HTMLInputElement>) => setUserQuery(event.currentTarget.value)}
          value={userQuery}
          placeholder="Filtrér på navn"
        />
        {userQuery !== "" && (
          <button className="btn btn-link" type="button" onClick={() => setUserQuery("")}>
            Vis alle
          </button>
        )}
        <div className={styles.userList}>
          {filteredUsers.map((user: User) => (
            <UserCard
              key={user.id}
              active={selectedUser === user.id}
              onUser={() => {
                setSelectedUser(user.id);
              }}
              user={user}
            />
          ))}
        </div>
      </section>
      <section className={styles.amountSection}>
        <h2>Hvor mye?</h2>
        <input name="amount" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" />
      </section>
      <section className={styles.checkout}>
        <button type="button" className="btn btn-primary btn-lg" onClick={onSubmit}>
          Sett inn
        </button>{" "}
        <button type="button" className="btn btn-outline-secondary btn-lg" onClick={reset}>
          Start på nytt
        </button>
      </section>
    </div>
  );
};
