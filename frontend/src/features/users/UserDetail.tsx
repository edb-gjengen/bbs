import { useQuery } from "@apollo/client";
import { ResponsiveLine } from "@nivo/line";
import React from "react";
import { useParams } from "react-router-dom";

import { GQLError } from "../../components/GQLError";
import { SchemaUser as User, UserDetailDocument, SchemaUserProfile as UserProfile } from "../../types";
import { formatMonth, formatTime } from "../../utils/time";
import { chartTheme, chartTooltipStyle } from "../stats/chartTheme";
import styles from "./UserDetail.module.css";

const UserDetail = () => {
  const { userId } = useParams();
  const { data, loading, error } = useQuery(UserDetailDocument, { variables: { userId: userId || "" }, skip: !userId });

  if (loading) return <div>Loading...</div>;

  if (error) return <GQLError error={error} />;

  const user = data?.user as User;
  const profile = user?.profile as UserProfile;
  const series = (profile?.productOrderStats || []).map(({ productName: id, data }) => ({
    id,
    data: data.map((point, index, points) => ({
      x: point.x,
      y: point.y + (points[index - 1]?.y || 0),
    })),
  }));
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
          <ResponsiveLine
            data={series}
            theme={chartTheme}
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
              legendPosition: "middle",
              legendOffset: -20,
            }}
            useMesh
            pointLabelYOffset={0}
            tooltip={({ point }) => (
              <div style={chartTooltipStyle}>
                <div>
                  <strong>{point.data.xFormatted}</strong>
                </div>
                <div>
                  <span style={{ background: point.seriesColor, width: 13, height: 13, display: "inline-block" }} />{" "}
                  <strong>{String(point.data.yFormatted)}</strong> {point.seriesId}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};
export default UserDetail;
