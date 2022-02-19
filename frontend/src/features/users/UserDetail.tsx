import { useQuery } from "@apollo/client";
import { Line } from "@nivo/line";
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
  // FIXME: types
  const series: any[] = [];
  (profile?.productOrderStats || [])?.forEach(({ productName: id, data }) => {
    const lineData: any[] = [];
    data.forEach((point, index) => {
      lineData.push({ x: point.x, y: point.y + (lineData?.[index - 1]?.y || 0) });
    });
    series.push({ id, data: lineData });
  });
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
      <div>
        <Line
          data={series}
          width={1000}
          height={400}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{
            type: "time",
            format: "%Y-%m-%d",
            useUTC: false,
            precision: "day",
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: "linear",
            stacked: false,
          }}
          axisLeft={{
            legend: "Purchases",
            legendOffset: 12,
          }}
          axisBottom={{
            format: "%b %Y",
            legend: "Date",
            legendOffset: -12,
          }}
          useMesh
          pointLabelYOffset={0}
          tooltip={({ point }) => (
            <div
              style={{
                background: "white",
                padding: "9px 12px",
                border: "1px solid #ccc",
              }}
            >
              <div>
                <strong>{point.data.xFormatted}</strong>
              </div>
              <div>
                <span style={{ background: point.serieColor, width: 13, height: 13, display: "inline-block" }} />{" "}
                <strong>{point.data.yFormatted}</strong> {point.serieId}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
