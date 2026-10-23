import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({ uri: import.meta.env.DEV ? "/graphql/" : `${import.meta.env.VITE_API_URL}/graphql/` }),
  cache: new InMemoryCache(),
});

export default client;
