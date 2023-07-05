import clsx from "clsx";
import React, { MouseEventHandler } from "react";

import { AllUsersQuery } from "../../types";
import styles from "./UserCard.module.css";

type UserCardProps = {
  user: AllUsersQuery["allUsers"][0] | null;
  onUser: MouseEventHandler;
  active: boolean;
};

/** If user is null, then it's the special external user */
export const UserCard = ({ user, onUser, active = false }: UserCardProps): JSX.Element => {
  const classes = clsx(styles.user, { [styles.active]: active });
  return (
    <button className={classes} onClick={onUser} type="button" title={user?.firstName || "Ekstern"}>
      <div className={styles.avatarWrap}>
        {user?.profile?.image && (
          <img src={user.profile?.image} alt={`Profile for ${user.firstName}`} className={styles.avatar} />
        )}
        {!user?.profile?.image && (
          <span className={styles.avatar}>
            <span className={styles.noAvatar} />
          </span>
        )}
      </div>
      <div className={styles.meta}>
        {user?.firstName || "Ekstern"}
        <span className={styles.balance}>{Number(user?.profile?.balance) || ""}</span>
      </div>
    </button>
  );
};
