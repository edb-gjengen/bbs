import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";

import { User, UserDetailDocument, UserProfile } from "../../types";
import { formatMonth, formatTime } from "../../utils/time";
import styles from "./UserDetail.module.css";

export const UserDetail = () => {
  const { userId } = useParams();
  const { data, loading } = useQuery(UserDetailDocument, { variables: { userId: userId || "" }, skip: !userId });

  if (loading) return <div>Loading...</div>;

  const user = data?.user as User;
  const profile = user?.profile as UserProfile;
  return (
    <div className={styles.userDetail}>
      <div>
        <h1>
          {profile.image && <img src={profile.image} alt={`${user.firstName}s profile picture`} />} {user.firstName}
        </h1>
        <div className="card">
          <div className="card-header">Stats</div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              Saldo: <strong>{profile.balance.toLocaleString("no")} kr</strong>
            </li>
            <li className="list-group-item">
              Siste kjøp: <strong>{formatTime(profile.lastPurchaseDate)}</strong>
            </li>
            <li className="list-group-item">
              Kjøp totalt: <strong>{profile.orderSumTotal.toLocaleString("no")} kr</strong>
            </li>
          </ul>
        </div>
        <br />
        <div className="card">
          <div className="card-header">Top 5 måneder</div>
          <ul className="list-group list-group-flush">
            {profile.topMonths.map((topMonth) => (
              <li key={topMonth.period} className="list-group-item">
                {formatMonth(topMonth.period)}: <strong>{topMonth.count}</strong> kjøp på totalt{" "}
                <strong>{topMonth.sum} kr</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>TODO: produktgraf</div>
    </div>
  );
};
