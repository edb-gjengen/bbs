import type { ErrorLike } from "@apollo/client";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

import styles from "./GQLError.module.css";

const formatModel = (text: string) => {
  const withSpaces = text
    .replace(/([A-Z])/g, " $1")
    .toLocaleLowerCase()
    .trim();
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

export const GQLError = ({ error }: { error: ErrorLike }) => {
  if (error instanceof CombinedGraphQLErrors && error.errors.length === 1) {
    const single = error.errors[0];
    if (single?.extensions?.code === "NOT_FOUND") {
      const modelPretty = formatModel(single?.extensions?.model as string);
      return <div className={styles.errorMessage}>{`${modelPretty} not found`}</div>;
    }
  }
  return <div className={styles.errorMessage}>Error...</div>;
};
