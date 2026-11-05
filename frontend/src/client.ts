import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import { apiUrl } from "./utils/api";

const client = new ApolloClient({
  link: new HttpLink({ uri: apiUrl("/graphql/") }),
  cache: new InMemoryCache(),
});

export default client;
