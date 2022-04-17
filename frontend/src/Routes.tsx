import React from "react";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom";

const Splash = React.lazy(() => import("./components/Splash"));
const UserCreate = React.lazy(() => import("./features/auth/UserCreate"));
const Deposit = React.lazy(() => import("./features/deposit/Deposit"));
const Log = React.lazy(() => import("./features/log/Log"));
const Register = React.lazy(() => import("./features/register/Register"));
const OrderStats = React.lazy(() => import("./features/stats/OrderStats"));
const ProductStats = React.lazy(() => import("./features/stats/ProductStats"));
const Stats = React.lazy(() => import("./features/stats/Stats"));
const UserDetail = React.lazy(() => import("./features/users/UserDetail"));
const UserList = React.lazy(() => import("./features/users/UserList"));

export const Routes = (): JSX.Element => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <ReactRouterRoutes>
      <Route path="/deposit" element={<Deposit />} />
      <Route path="/log" element={<Log />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/stats/orders" element={<OrderStats />} />
      <Route path="/stats/products" element={<ProductStats />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/create" element={<UserCreate />} />
      <Route path="/user/:userId" element={<UserDetail />} />
      <Route path="/" element={<Register />} />
      <Route path="*" element={<Splash brandText="404" noOverlay />} />
    </ReactRouterRoutes>
  </React.Suspense>
);
