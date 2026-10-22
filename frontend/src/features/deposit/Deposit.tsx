import React from "react";

import { UserCard } from "../users/UserCard";
import styles from "./Deposit.module.css";
import { useDeposit } from "./useDeposit";

const Deposit = (): JSX.Element => {
  const {
    loading,
    selectedUser,
    toggleSelectedUser,
    amount,
    setAmount,
    userQuery,
    setUserQuery,
    filteredUsers,
    selectedUserDetails,
    reset,
    onSubmit,
  } = useDeposit();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.deposit}>
      <h2 className={styles.heading}>Hvem skal sette inn penger?</h2>
      <div className={styles.search}>
        <input
          name="userQuery"
          onChange={(event: React.FormEvent<HTMLInputElement>) => setUserQuery(event.currentTarget.value)}
          value={userQuery}
          placeholder="Filtrér på navn"
          aria-label="Filtrér personer på navn"
        />
        {userQuery !== "" && (
          <button type="button" onClick={() => setUserQuery("")}>
            Vis alle
          </button>
        )}
      </div>
      <section className={styles.amountSection} aria-label="Innskudd">
        <h2>Hvor mye?</h2>
        {selectedUserDetails ? (
          <p className={styles.selectedUser}>
            Innskudd til{" "}
            <strong>
              {selectedUserDetails.firstName} {selectedUserDetails.lastName}
            </strong>
          </p>
        ) : (
          <p className={styles.selectedUser}>Velg en person fra listen</p>
        )}
        <label className={styles.amountLabel} htmlFor="deposit-amount">
          Beløp
        </label>
        <div className={styles.amountInput}>
          <input
            id="deposit-amount"
            name="amount"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0"
          />
          <span>kr</span>
        </div>
        <div className={styles.checkout}>
          <button type="button" onClick={onSubmit} className="primary">
            Sett inn
          </button>
          <button type="button" onClick={reset}>
            Start på nytt
          </button>
        </div>
      </section>
      <div className={styles.userList}>
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            active={selectedUser === user.id}
            onUser={() => toggleSelectedUser(user.id)}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};
export default Deposit;
