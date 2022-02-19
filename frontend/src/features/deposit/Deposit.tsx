import React from "react";

import { UserCard } from "../../components/UserCard";
import styles from "./Deposit.module.css";
import { useDeposit } from "./useDeposit";

export const Deposit: React.FC = () => {
  const {
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
  } = useDeposit();

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
          {filteredUsers.map((user) => (
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
