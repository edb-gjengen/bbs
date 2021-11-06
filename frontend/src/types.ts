import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date with time (isoformat) */
  DateTime: any;
};

export type CreateOrderResponse = CreateOrderSuccess | FormErrors | InsufficientFunds;

export type CreateOrderSuccess = {
  __typename?: 'CreateOrderSuccess';
  order: Order;
};

export type Error = {
  error: Scalars['Boolean'];
  message: Scalars['String'];
};

export type FieldError = Error & {
  __typename?: 'FieldError';
  error: Scalars['Boolean'];
  field: Scalars['String'];
  message: Scalars['String'];
};

export type FormErrors = {
  __typename?: 'FormErrors';
  error: Scalars['Boolean'];
  fields: Array<FieldError>;
  message: Scalars['String'];
};

export type InsufficientFunds = Error & {
  __typename?: 'InsufficientFunds';
  amountLacking: Scalars['Float'];
  error: Scalars['Boolean'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrder: CreateOrderResponse;
};


export type MutationCreateOrderArgs = {
  customerId: Scalars['ID'];
  isExternal?: Scalars['Boolean'];
  orderLines: Array<OrderLineInput>;
};

export type Order = {
  __typename?: 'Order';
  created: Scalars['DateTime'];
  customer?: Maybe<User>;
  id: Scalars['ID'];
  orderSum: Scalars['Float'];
};

export type OrderLineInput = {
  amount: Scalars['Int'];
  productId: Scalars['ID'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['ID'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
  salePriceExt: Scalars['Float'];
  salePriceInt: Scalars['Float'];
};

export type ProductFilter = {
  active?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  allOrders: Array<Order>;
  allProducts: Array<Product>;
  allUsers: Array<User>;
};


export type QueryAllProductsArgs = {
  filters?: Maybe<ProductFilter>;
};

export type User = {
  __typename?: 'User';
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  profile?: Maybe<UserProfile>;
};

export type UserProfile = {
  __typename?: 'UserProfile';
  balance: Scalars['Float'];
  id: Scalars['ID'];
  image: Scalars['String'];
  lastPurchaseDate: Scalars['DateTime'];
};

export type AllProductsQueryVariables = Exact<{
  active: Scalars['Boolean'];
}>;


export type AllProductsQuery = { __typename?: 'Query', allProducts: Array<{ __typename?: 'Product', id: string, name: string, imageUrl: string, salePriceExt: number, salePriceInt: number }> };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename?: 'Query', allUsers: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, profile?: { __typename?: 'UserProfile', id: string, balance: number, image: string, lastPurchaseDate: any } | null | undefined }> };

export type CreateOrderMutationVariables = Exact<{
  customerId: Scalars['ID'];
  orderLines: Array<OrderLineInput> | OrderLineInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'CreateOrderSuccess', order: { __typename?: 'Order', id: string, orderSum: number, customer?: { __typename?: 'User', id: string } | null | undefined } } | { __typename?: 'FormErrors', error: boolean, message: string, fields: Array<{ __typename?: 'FieldError', field: string, message: string }> } | { __typename?: 'InsufficientFunds', error: boolean, message: string, amountLacking: number } };


export const AllProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceExt"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceInt"}}]}}]}}]} as unknown as DocumentNode<AllProductsQuery, AllProductsQueryVariables>;
export const AllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"lastPurchaseDate"}}]}}]}}]}}]} as unknown as DocumentNode<AllUsersQuery, AllUsersQueryVariables>;
export const CreateOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderLines"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderLineInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderLines"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderLines"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrderSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderSum"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsufficientFunds"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"amountLacking"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormErrors"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateOrderMutation, CreateOrderMutationVariables>;