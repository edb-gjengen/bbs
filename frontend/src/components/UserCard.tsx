import { ReactComponent as PersonFill } from "bootstrap-icons/icons/person-fill.svg";
import clsx from "clsx";
import React, { MouseEventHandler } from "react";

import { User } from "../types";
import styles from "./UserCard.module.css";

type UserCardProps = {
  user: User | null;
  onUser: MouseEventHandler;
  active: boolean;
};

/** If user is null, then it's the special external user */
export const UserCard: React.FC<UserCardProps> = ({ user, onUser, active = false }) => {
  const classes = clsx(styles.user, { [styles.active]: active });
  return (
    <button className={classes} onClick={onUser} type="button">
      {user?.profile?.image && (
        <img src={user.profile?.image} alt={`Profile for ${user.firstName}`} className={styles.avatar} />
      )}
      {!user?.profile?.image && (
        <span className={styles.avatar}>
          <PersonFill />
        </span>
      )}
      <span className={styles.name}>{user?.firstName || "Ekstern"}</span>
      <span className={styles.balance}>{user?.profile?.balance || ""}</span>
    </button>
  );
};
