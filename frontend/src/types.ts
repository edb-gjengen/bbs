/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date with time (isoformat) */
  DateTime: { input: string; output: string; }
  /** Decimal (fixed-point) */
  Decimal: { input: string; output: string; }
  /** The GenericScalar scalar type represents a generic GraphQL scalar value that could be: List or Object. */
  JSONScalar: { input: unknown; output: Array<{ name: string; count: number }>; }
};

export type SchemaAboveMaxSaldo = SchemaError & {
  __typename?: 'AboveMaxSaldo';
  message: Scalars['String']['output'];
  error: Scalars['Boolean']['output'];
  maxSaldo: Scalars['Float']['output'];
  above: Scalars['Float']['output'];
};

export type SchemaCreateDepositResponse = SchemaCreateDepositSuccess | SchemaAboveMaxSaldo | SchemaFormErrors;

export type SchemaCreateDepositSuccess = {
  __typename?: 'CreateDepositSuccess';
  transaction: SchemaTransaction;
};

export type SchemaCreateOrderResponse = SchemaCreateOrderSuccess | SchemaInsufficientFunds | SchemaFormErrors;

export type SchemaCreateOrderSuccess = {
  __typename?: 'CreateOrderSuccess';
  order: SchemaOrder;
};

export type SchemaError = {
  message: Scalars['String']['output'];
  error: Scalars['Boolean']['output'];
};

export type SchemaFieldError = SchemaError & {
  __typename?: 'FieldError';
  message: Scalars['String']['output'];
  error: Scalars['Boolean']['output'];
  field: Scalars['String']['output'];
};

export type SchemaFormErrors = {
  __typename?: 'FormErrors';
  fields: Array<SchemaFieldError>;
  message: Scalars['String']['output'];
  error: Scalars['Boolean']['output'];
};

export type SchemaInsufficientFunds = SchemaError & {
  __typename?: 'InsufficientFunds';
  message: Scalars['String']['output'];
  error: Scalars['Boolean']['output'];
  amountLacking: Scalars['Float']['output'];
};

export type SchemaMutation = {
  __typename?: 'Mutation';
  createOrder: SchemaCreateOrderResponse;
  createDeposit: SchemaCreateDepositResponse;
  createUser: SchemaUser;
};


export type SchemaMutationCreateOrderArgs = {
  customerId: Scalars['ID']['input'];
  orderLines: Array<SchemaOrderLineInput>;
  isExternal?: Scalars['Boolean']['input'];
};


export type SchemaMutationCreateDepositArgs = {
  userId: Scalars['ID']['input'];
  amount: Scalars['Int']['input'];
};


export type SchemaMutationCreateUserArgs = {
  input: SchemaUserInput;
};

export type SchemaOffsetPaginationInput = {
  offset?: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type SchemaOrder = {
  __typename?: 'Order';
  id: Scalars['ID']['output'];
  customer?: Maybe<SchemaUser>;
  orderSum: Scalars['Decimal']['output'];
  created: Scalars['DateTime']['output'];
  orderlines: Array<SchemaOrderLine>;
  isExternal: Scalars['Boolean']['output'];
};

export type SchemaOrderLine = {
  __typename?: 'OrderLine';
  id: Scalars['ID']['output'];
  order: SchemaOrder;
  product: SchemaProduct;
  amount: Scalars['Int']['output'];
  unitPrice: Scalars['Decimal']['output'];
};

export type SchemaOrderLineInput = {
  productId: Scalars['ID']['input'];
  amount: Scalars['Int']['input'];
};

export type SchemaOrderOrdering =
  { created: SchemaOrdering; };

export type SchemaOrderStats = {
  __typename?: 'OrderStats';
  yearly: Array<SchemaOrderStatsByTime>;
  monthly: Array<SchemaOrderStatsByTime>;
  daily: Array<SchemaOrderStatsByTime>;
  hourly: Array<SchemaOrderStatsByTime>;
};

export type SchemaOrderStatsByTime = {
  __typename?: 'OrderStatsByTime';
  period: Scalars['Int']['output'];
  count: Scalars['String']['output'];
};

export enum SchemaOrdering {
  Asc = 'ASC',
  AscNullsFirst = 'ASC_NULLS_FIRST',
  AscNullsLast = 'ASC_NULLS_LAST',
  Desc = 'DESC',
  DescNullsFirst = 'DESC_NULLS_FIRST',
  DescNullsLast = 'DESC_NULLS_LAST'
}

export type SchemaPoint = {
  __typename?: 'Point';
  x: Scalars['String']['output'];
  y: Scalars['Int']['output'];
};

export type SchemaProduct = {
  __typename?: 'Product';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  imageUrl: Scalars['String']['output'];
  salePriceInt: Scalars['Decimal']['output'];
  salePriceExt: Scalars['Decimal']['output'];
  userCounts: Scalars['JSONScalar']['output'];
};

export type SchemaProductFilter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  active?: InputMaybe<Scalars['Boolean']['input']>;
  AND?: InputMaybe<SchemaProductFilter>;
  OR?: InputMaybe<SchemaProductFilter>;
  NOT?: InputMaybe<SchemaProductFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SchemaProductOrderStat = {
  __typename?: 'ProductOrderStat';
  productName: Scalars['String']['output'];
  data: Array<SchemaPoint>;
};

export type SchemaQuery = {
  __typename?: 'Query';
  transactionList: Array<SchemaTransaction>;
  allProducts: Array<SchemaProduct>;
  allOrders: Array<SchemaOrder>;
  orderList: Array<SchemaOrder>;
  orderStats: SchemaOrderStats;
  productStats: Array<SchemaProductOrderStat>;
  allUsers: Array<SchemaUser>;
  user: SchemaUser;
};


export type SchemaQueryTransactionListArgs = {
  ordering?: Array<SchemaTransactionOrdering>;
  pagination?: InputMaybe<SchemaOffsetPaginationInput>;
};


export type SchemaQueryAllProductsArgs = {
  filters?: InputMaybe<SchemaProductFilter>;
};


export type SchemaQueryOrderListArgs = {
  ordering?: Array<SchemaOrderOrdering>;
  pagination?: InputMaybe<SchemaOffsetPaginationInput>;
};


export type SchemaQueryUserArgs = {
  userId: Scalars['ID']['input'];
};

export type SchemaTopMonth = {
  __typename?: 'TopMonth';
  period: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  sum: Scalars['Float']['output'];
};

export type SchemaTransaction = {
  __typename?: 'Transaction';
  id: Scalars['ID']['output'];
  user: SchemaUser;
  amount: Scalars['Decimal']['output'];
  created: Scalars['DateTime']['output'];
};

export type SchemaTransactionOrdering =
  { created: SchemaOrdering; };

export type SchemaUser = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  profile?: Maybe<SchemaUserProfile>;
};

export type SchemaUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
};

export type SchemaUserProfile = {
  __typename?: 'UserProfile';
  id: Scalars['ID']['output'];
  balance: Scalars['Decimal']['output'];
  image: Scalars['String']['output'];
  lastPurchaseDate: Scalars['DateTime']['output'];
  orderSumTotal: Scalars['Decimal']['output'];
  topMonths: Array<SchemaTopMonth>;
  productOrderStats: Array<SchemaProductOrderStat>;
};

export type OrderLineInput = {
  productId: string | number;
  amount: number;
};

export type CreateUserMutationVariables = Exact<{
  firstName: string;
  lastName: string;
  email: string;
}>;


export type CreateUserMutation = { __typename: 'Mutation', createUser: { __typename: 'User', id: string, firstName: string, lastName: string, profile: { __typename: 'UserProfile', id: string } | null } };

export type CreateDepositMutationVariables = Exact<{
  userId: string | number;
  amount: number;
}>;


export type CreateDepositMutation = { __typename: 'Mutation', createDeposit:
    | { __typename: 'CreateDepositSuccess', transaction: { __typename: 'Transaction', id: string, amount: string, user: { __typename: 'User', id: string, firstName: string, lastName: string, profile: { __typename: 'UserProfile', id: string, balance: string } | null } } }
    | { __typename: 'AboveMaxSaldo', error: boolean, message: string, maxSaldo: number, above: number }
    | { __typename: 'FormErrors', error: boolean, message: string, fields: Array<{ __typename: 'FieldError', field: string, message: string }> }
   };

export type OrderListQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type OrderListQuery = { __typename: 'Query', orderList: Array<{ __typename: 'Order', id: string, isExternal: boolean, created: string, orderSum: string, customer: { __typename: 'User', id: string, firstName: string, lastName: string, profile: { __typename: 'UserProfile', id: string, balance: string } | null } | null, orderlines: Array<{ __typename: 'OrderLine', id: string, amount: number, unitPrice: string, product: { __typename: 'Product', id: string, name: string, salePriceExt: string, salePriceInt: string } }> }> };

export type TransactionListQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type TransactionListQuery = { __typename: 'Query', transactionList: Array<{ __typename: 'Transaction', id: string, created: string, amount: string, user: { __typename: 'User', id: string, firstName: string, lastName: string, profile: { __typename: 'UserProfile', id: string, balance: string } | null } }> };

export type AllProductsQueryVariables = Exact<{
  active: boolean;
}>;


export type AllProductsQuery = { __typename: 'Query', allProducts: Array<{ __typename: 'Product', id: string, name: string, imageUrl: string, salePriceExt: string, salePriceInt: string }> };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename: 'Query', allUsers: Array<{ __typename: 'User', id: string, firstName: string, lastName: string, profile: { __typename: 'UserProfile', id: string, balance: string, image: string, lastPurchaseDate: string } | null }> };

export type CreateOrderMutationVariables = Exact<{
  customerId: string | number;
  orderLines: Array<OrderLineInput> | OrderLineInput;
  isExternal: boolean;
}>;


export type CreateOrderMutation = { __typename: 'Mutation', createOrder:
    | { __typename: 'CreateOrderSuccess', order: { __typename: 'Order', id: string, isExternal: boolean, orderSum: string, customer: { __typename: 'User', id: string, firstName: string, lastName: string, profile: { __typename: 'UserProfile', id: string, balance: string } | null } | null, orderlines: Array<{ __typename: 'OrderLine', id: string, amount: number, unitPrice: string, product: { __typename: 'Product', id: string, name: string, salePriceExt: string, salePriceInt: string } }> } }
    | { __typename: 'InsufficientFunds', error: boolean, message: string, amountLacking: number }
    | { __typename: 'FormErrors', error: boolean, message: string, fields: Array<{ __typename: 'FieldError', field: string, message: string }> }
   };

export type AllProductStatsQueryVariables = Exact<{
  active?: boolean | null | undefined;
}>;


export type AllProductStatsQuery = { __typename: 'Query', allProducts: Array<{ __typename: 'Product', id: string, name: string, userCounts: Array<{ name: string; count: number }> }> };

export type OrderStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type OrderStatsQuery = { __typename: 'Query', orderStats: { __typename: 'OrderStats', yearly: Array<{ __typename: 'OrderStatsByTime', period: number, count: string }>, monthly: Array<{ __typename: 'OrderStatsByTime', period: number, count: string }>, daily: Array<{ __typename: 'OrderStatsByTime', period: number, count: string }>, hourly: Array<{ __typename: 'OrderStatsByTime', period: number, count: string }> } };

export type ProductStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductStatsQuery = { __typename: 'Query', productStats: Array<{ __typename: 'ProductOrderStat', productName: string, data: Array<{ __typename: 'Point', x: string, y: number }> }> };

export type UserDetailQueryVariables = Exact<{
  userId: string | number;
}>;


export type UserDetailQuery = { __typename: 'Query', user: { __typename: 'User', id: string, firstName: string, lastName: string, profile: { __typename: 'UserProfile', id: string, balance: string, image: string, lastPurchaseDate: string, orderSumTotal: string, topMonths: Array<{ __typename: 'TopMonth', period: string, sum: number, count: number }>, productOrderStats: Array<{ __typename: 'ProductOrderStat', productName: string, data: Array<{ __typename: 'Point', x: string, y: number }> }> } | null } };


export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const CreateDepositDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDeposit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDeposit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDepositSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AboveMaxSaldo"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"maxSaldo"}},{"kind":"Field","name":{"kind":"Name","value":"above"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormErrors"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateDepositMutation, CreateDepositMutationVariables>;
export const OrderListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"orderList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ordering"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"orderSum"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderlines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceExt"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceInt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OrderListQuery, OrderListQueryVariables>;
export const TransactionListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"transactionList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ordering"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created"},"value":{"kind":"EnumValue","value":"DESC"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}}]}}]}}]} as unknown as DocumentNode<TransactionListQuery, TransactionListQueryVariables>;
export const AllProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceExt"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceInt"}}]}}]}}]} as unknown as DocumentNode<AllProductsQuery, AllProductsQueryVariables>;
export const AllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"lastPurchaseDate"}}]}}]}}]}}]} as unknown as DocumentNode<AllUsersQuery, AllUsersQueryVariables>;
export const CreateOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderLines"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderLineInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isExternal"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"customerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"customerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderLines"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderLines"}}},{"kind":"Argument","name":{"kind":"Name","value":"isExternal"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isExternal"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrderSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderlines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceExt"}},{"kind":"Field","name":{"kind":"Name","value":"salePriceInt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderSum"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InsufficientFunds"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"amountLacking"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FormErrors"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateOrderMutation, CreateOrderMutationVariables>;
export const AllProductStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allProductStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userCounts"}}]}}]}}]} as unknown as DocumentNode<AllProductStatsQuery, AllProductStatsQueryVariables>;
export const OrderStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"orderStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orderStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"yearly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"daily"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hourly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<OrderStatsQuery, OrderStatsQueryVariables>;
export const ProductStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"productStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}}]}}]} as unknown as DocumentNode<ProductStatsQuery, ProductStatsQueryVariables>;
export const UserDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"lastPurchaseDate"}},{"kind":"Field","name":{"kind":"Name","value":"topMonths"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"sum"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productOrderStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderSumTotal"}}]}}]}}]}}]} as unknown as DocumentNode<UserDetailQuery, UserDetailQueryVariables>;