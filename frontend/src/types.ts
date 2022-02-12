import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  /** The GenericScalar scalar type represents a generic GraphQL scalar value that could be: List or Object. */
  JSONScalar: any;
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

export type OffsetPaginationInput = {
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
};

export type Order = {
  __typename?: 'Order';
  created: Scalars['DateTime'];
  customer?: Maybe<User>;
  id: Scalars['ID'];
  isExternal: Scalars['Boolean'];
  orderSum: Scalars['Float'];
  orderlines?: Maybe<Array<OrderLine>>;
};

export type OrderLine = {
  __typename?: 'OrderLine';
  amount: Scalars['Int'];
  id: Scalars['ID'];
  order: Order;
  product: Product;
  unitPrice: Scalars['Float'];
};

export type OrderLineInput = {
  amount: Scalars['Int'];
  productId: Scalars['ID'];
};

export type OrderOrdering = {
  created?: InputMaybe<Ordering>;
};

export type OrderStats = {
  __typename?: 'OrderStats';
  daily: Array<OrderStatsByTime>;
  hourly: Array<OrderStatsByTime>;
  monthly: Array<OrderStatsByTime>;
  yearly: Array<OrderStatsByTime>;
};

export type OrderStatsByTime = {
  __typename?: 'OrderStatsByTime';
  count: Scalars['String'];
  period: Scalars['Int'];
};

export enum Ordering {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Product = {
  __typename?: 'Product';
  id: Scalars['ID'];
  imageUrl: Scalars['String'];
  name: Scalars['String'];
  salePriceExt: Scalars['Float'];
  salePriceInt: Scalars['Float'];
  userCounts: Scalars['JSONScalar'];
};

export type ProductFilter = {
  active?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  allOrders: Array<Order>;
  allProducts: Array<Product>;
  allUsers: Array<User>;
  orderList: Array<Order>;
  orderStats: OrderStats;
  transactionList: Array<Transaction>;
  user: User;
};


export type QueryAllProductsArgs = {
  filters?: InputMaybe<ProductFilter>;
};


export type QueryOrderListArgs = {
  order?: InputMaybe<OrderOrdering>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryTransactionListArgs = {
  order?: InputMaybe<TransactionOrdering>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryUserArgs = {
  userId: Scalars['ID'];
};

export type TopMonth = {
  __typename?: 'TopMonth';
  count: Scalars['Int'];
  period: Scalars['String'];
  sum: Scalars['Int'];
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float'];
  created: Scalars['DateTime'];
  id: Scalars['ID'];
  user: User;
};

export type TransactionOrdering = {
  created?: InputMaybe<Ordering>;
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
  orderSumTotal: Scalars['Float'];
  topMonths: Array<TopMonth>;
};

export type CreateDepositMutationVariables = Exact<{
  userId: Scalars['ID'];
  amount: Scalars['Int'];
}>;


export type CreateDepositMutation = { __typename?: 'Mutation', createDeposit: { __typename?: 'AboveMaxSaldo', error: boolean, message: string, maxSaldo: number, above: number } | { __typename?: 'CreateDepositSuccess', transaction: { __typename?: 'Transaction', id: string, amount: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, profile?: { __typename?: 'UserProfile', id: string, balance: number } | null } } } | { __typename?: 'FormErrors', error: boolean, message: string, fields: Array<{ __typename?: 'FieldError', field: string, message: string }> } };

export type OrderListQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type OrderListQuery = { __typename?: 'Query', orderList: Array<{ __typename?: 'Order', id: string, isExternal: boolean, created: any, orderSum: number, customer?: { __typename?: 'User', id: string, firstName: string, lastName: string, profile?: { __typename?: 'UserProfile', id: string, balance: number } | null } | null, orderlines?: Array<{ __typename?: 'OrderLine', id: string, amount: number, unitPrice: number, product: { __typename?: 'Product', id: string, name: string, salePriceExt: number, salePriceInt: number } }> | null }> };

export type TransactionListQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type TransactionListQuery = { __typename?: 'Query', transactionList: Array<{ __typename?: 'Transaction', id: string, created: any, amount: number, user: { __typename?: 'User', id: string, firstName: string, lastName: string, profile?: { __typename?: 'UserProfile', id: string, balance: number } | null } }> };

export type AllProductsQueryVariables = Exact<{
  active: Scalars['Boolean'];
}>;


export type AllProductsQuery = { __typename?: 'Query', allProducts: Array<{ __typename?: 'Product', id: string, name: string, imageUrl: string, salePriceExt: number, salePriceInt: number }> };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename?: 'Query', allUsers: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, profile?: { __typename?: 'UserProfile', id: string, balance: number, image: string, lastPurchaseDate: any } | null }> };

export type CreateOrderMutationVariables = Exact<{
  customerId: Scalars['ID'];
  orderLines: Array<OrderLineInput> | OrderLineInput;
  isExternal: Scalars['Boolean'];
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'CreateOrderSuccess', order: { __typename?: 'Order', id: string, isExternal: boolean, orderSum: number, customer?: { __typename?: 'User', id: string, firstName: string, lastName: string, profile?: { __typename?: 'UserProfile', id: string, balance: number } | null } | null, orderlines?: Array<{ __typename?: 'OrderLine', id: string, amount: number, unitPrice: number, product: { __typename?: 'Product', id: string, name: string, salePriceExt: number, salePriceInt: number } }> | null } } | { __typename?: 'FormErrors', error: boolean, message: string, fields: Array<{ __typename?: 'FieldError', field: string, message: string }> } | { __typename?: 'InsufficientFunds', error: boolean, message: string, amountLacking: number } };

export type OrderStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrderStatsQuery = { __typename?: 'Query', orderStats: { __typename?: 'OrderStats', yearly: Array<{ __typename?: 'OrderStatsByTime', period: number, count: string }>, monthly: Array<{ __typename?: 'OrderStatsByTime', period: number, count: string }>, daily: Array<{ __typename?: 'OrderStatsByTime', period: number, count: string }>, hourly: Array<{ __typename?: 'OrderStatsByTime', period: number, count: string }> } };

export type ProductStatsQueryVariables = Exact<{
  active?: InputMaybe<Scalars['Boolean']>;
}>;


export type ProductStatsQuery = { __typename?: 'Query', allProducts: Array<{ __typename?: 'Product', id: string, name: string, userCounts: any }> };

export type UserDetailQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type UserDetailQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, firstName: string, lastName: string, profile?: { __typename?: 'UserProfile', id: string, balance: number, image: string, lastPurchaseDate: any, orderSumTotal: number, topMonths: Array<{ __typename?: 'TopMonth', period: string, sum: number, count: number }> } | null } };


export const CreateDepositDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDeposit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDeposit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDepositSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AboveMaxSaldo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"maxSaldo"}},{"kind":"Field","name":{"kind":"Name","value":"above"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormErrors"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateDepositMutation, CreateDepositMutationVariables>;
export const OrderListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"orderList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"orderSum"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderlines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceExt"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceInt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrderListQuery, OrderListQueryVariables>;
export const TransactionListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"transactionList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created"},"value":{"kind":"EnumValue","value":"DESC"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TransactionListQuery, TransactionListQueryVariables>;
export const AllProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceExt"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceInt"}}]}}]}}]} as unknown as DocumentNode<AllProductsQuery, AllProductsQueryVariables>;
export const AllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"lastPurchaseDate"}}]}}]}}]}}]} as unknown as DocumentNode<AllUsersQuery, AllUsersQueryVariables>;
export const CreateOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderLines"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderLineInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isExternal"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderLines"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderLines"}}},{"kind":"Argument","name":{"kind":"Name","value":"isExternal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isExternal"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrderSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderlines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceExt"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceInt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderSum"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsufficientFunds"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"amountLacking"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormErrors"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateOrderMutation, CreateOrderMutationVariables>;
export const OrderStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"orderStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hourly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<OrderStatsQuery, OrderStatsQueryVariables>;
export const ProductStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"productStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userCounts"}}]}}]}}]} as unknown as DocumentNode<ProductStatsQuery, ProductStatsQueryVariables>;
export const UserDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"lastPurchaseDate"}},{"kind":"Field","name":{"kind":"Name","value":"topMonths"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"sum"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderSumTotal"}}]}}]}}]}}]} as unknown as DocumentNode<UserDetailQuery, UserDetailQueryVariables>;