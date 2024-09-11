import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Root from '../layout/Root';
import Error from '../pages/Error/Error';
import Home from '../pages/Home/Home';
import Products from '../pages/Products/Products';
import Accounts from '../pages/Accounts/Accounts';
import ProductsDetail from '../pages/Products/ProductsDetail';
import DashboardRoot from '../layout/DashboardRoot';
import ManageProducts from '../Admin/ManageProducts/ManageProducts';
import SignIn from '../Validation/Signin/Signin';
import SignUp from '../Validation/Signup/Signup';
import Profile from '../pages/Profile/Profile';
import PrivateRoute from '../Validation/PrivateRoute/PrivateRoute';
import AdminRoute from '../Validation/PrivateRoute/AdminRoute';
import CartList from '../shared/CartList';
import Dashboard from '../Admin/Dashboard/Dashboard';
import OrderRequest from '../Admin/OrderRequest/OrderRequest';
import MyBooking from '../pages/MyBooking/MyBooking';



const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <Error />,
        children: [
            { path: "/", element: <Home /> },
            { path: "products", element: <Products /> },
            { path: "products/:id", element: <ProductsDetail /> },
            { path: "my-booking", element: <MyBooking /> },
            { path: "cart", element: <CartList /> },
            { path: "signin", element: <SignIn /> },
            { path: "signup", element: <SignUp /> },
            {
                path: "profile",
                element: <PrivateRoute element={<Profile />} />
            },
        ]
    },
   
    {
        path: "/admin",
        element: <DashboardRoot />,
        errorElement: <Error />,
        children: [
            {
                path: "dashboard",
                element: <AdminRoute element={<Dashboard />} />
            },
            {
                path: "managed-products",
                element: <AdminRoute element={<ManageProducts />} />
            },
            {
                path: "accounts",
                element: <AdminRoute element={<Accounts />} />
            },
            {
                path: "order-request",
                element: <AdminRoute element={<OrderRequest />} />
            },
            
        ]
    },
]);

export default router;
