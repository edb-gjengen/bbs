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

export type AboveMaxSaldo = Error & {
  __typename?: 'AboveMaxSaldo';
  above: Scalars['Float'];
  error: Scalars['Boolean'];
  maxSaldo: Scalars['Float'];
  message: Scalars['String'];
};

export type CreateDepositResponse = AboveMaxSaldo | CreateDepositSuccess | FormErrors;

export type CreateDepositSuccess = {
  __typename?: 'CreateDepositSuccess';
  transaction: Transaction;
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
  createDeposit: CreateDepositResponse;
  createOrder: CreateOrderResponse;
};


export type MutationCreateDepositArgs = {
  amount: Scalars['Int'];
  userId: Scalars['ID'];
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

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float'];
  created: Scalars['DateTime'];
  id: Scalars['ID'];
  user: User;
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

export type CreateDepositMutationVariables = Exact<{
  userId: Scalars['ID'];
  amount: Scalars['Int'];
}>;


export type CreateDepositMutation = { __typename?: 'Mutation', createDeposit: { __typename?: 'AboveMaxSaldo', error: boolean, message: string, maxSaldo: number, above: number } | { __typename?: 'CreateDepositSuccess', transaction: { __typename?: 'Transaction', id: string, amount: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, profile?: { __typename?: 'UserProfile', balance: number } | null | undefined } } } | { __typename?: 'FormErrors', error: boolean, message: string, fields: Array<{ __typename?: 'FieldError', field: string, message: string }> } };

export type AllProductsQueryVariables = Exact<{
  active: Scalars['Boolean'];
}>;


export type AllProductsQuery = { __typename?: 'Query', allProducts: Array<{ __typename?: 'Product', id: string, name: string, imageUrl: string, salePriceExt: number, salePriceInt: number }> };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename?: 'Query', allUsers: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, profile?: { __typename?: 'UserProfile', id: string, balance: number, image: string, lastPurchaseDate: any } | null | undefined }> };

export type CreateOrderMutationVariables = Exact<{
  customerId: Scalars['ID'];
  orderLines: Array<OrderLineInput> | OrderLineInput;
  isExternal?: Maybe<Scalars['Boolean']>;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'CreateOrderSuccess', order: { __typename?: 'Order', id: string, orderSum: number, customer?: { __typename?: 'User', id: string } | null | undefined } } | { __typename?: 'FormErrors', error: boolean, message: string, fields: Array<{ __typename?: 'FieldError', field: string, message: string }> } | { __typename?: 'InsufficientFunds', error: boolean, message: string, amountLacking: number } };


export const CreateDepositDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDeposit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDeposit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDepositSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AboveMaxSaldo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"maxSaldo"}},{"kind":"Field","name":{"kind":"Name","value":"above"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormErrors"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateDepositMutation, CreateDepositMutationVariables>;
export const AllProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceExt"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceInt"}}]}}]}}]} as unknown as DocumentNode<AllProductsQuery, AllProductsQueryVariables>;
export const AllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"lastPurchaseDate"}}]}}]}}]}}]} as unknown as DocumentNode<AllUsersQuery, AllUsersQueryVariables>;
export const CreateOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderLines"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderLineInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isExternal"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderLines"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderLines"}}},{"kind":"Argument","name":{"kind":"Name","value":"isExternal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isExternal"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrderSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderSum"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsufficientFunds"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"amountLacking"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormErrors"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateOrderMutation, CreateOrderMutationVariables>;