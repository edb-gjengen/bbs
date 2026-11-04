import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";

import styles from "./UserDetail.module.css";
import { GQLError } from "../../components/GQLError";
import { SchemaUser as User, UserDetailDocument, SchemaUserProfile as UserProfile } from "../../types";
import { formatMonth, formatTime } from "../../utils/time";
import { PurchasesOverTimeChart } from "../stats/PurchasesOverTimeChart";

const UserDetail = () => {
  const { userId } = useParams();
  const { data, loading, error } = useQuery(UserDetailDocument, { variables: { userId: userId || "" }, skip: !userId });

  if (loading) return <div>Loading...</div>;

  if (error) return <GQLError error={error} />;

  const user = data?.user as User;
  const profile = user?.profile as UserProfile;
  return (
    <div className={styles.userDetail}>
      <div>
        <h1>
          {profile.image && <img src={profile.image} alt={`${user.firstName}s profile picture`} />} {user.firstName}
        </h1>
        <div>
          <div>Stats</div>
          <ul>
            <li>
              Saldo: <strong>{Number(profile.balance).toLocaleString("no")} kr</strong>
            </li>
            <li>
              Siste kjøp: <strong>{formatTime(profile.lastPurchaseDate)}</strong>
            </li>
            <li>
              Kjøp totalt: <strong>{Number(profile.orderSumTotal).toLocaleString("no")} kr</strong>
            </li>
          </ul>
        </div>
        <br />
        <div>
          <div>Top 5 måneder</div>
          <ul>
            {profile.topMonths.map((topMonth) => (
              <li key={topMonth.period}>
                {formatMonth(topMonth.period)}: <strong>{topMonth.count}</strong> kjøp på totalt{" "}
                <strong>{topMonth.sum} kr</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h2>Kjøp over tid</h2>
        <div className={styles.chart}>
          <PurchasesOverTimeChart stats={profile?.productOrderStats || []} />
        </div>
      </div>
    </div>
  );
};
export default UserDetail;
