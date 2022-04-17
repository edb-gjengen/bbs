import { ApolloError } from "@apollo/client";
import React from "react";

import styles from "./GQLError.module.css";

const formatModel = (text: string) => {
  const withSpaces = text
    .replace(/([A-Z])/g, " $1")
    .toLocaleLowerCase()
    .trim();
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

export const GQLError = ({ error }: { error: ApolloError }) => {
  if (error?.graphQLErrors?.length == 1) {
    const single = error?.graphQLErrors[0];
    if (single?.extensions?.code === "NOT_FOUND") {
      const modelPretty = formatModel(single?.extensions?.model as string);
      return <div className={styles.errorMessage}>{`${modelPretty} not found`}</div>;
    }
  }
  return <div className={styles.errorMessage}>Error...</div>;
};
