import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";
import Error from "../pages/Error/Error";
import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import Accounts from "../pages/Accounts/Accounts";
import ProductsDetail from "../pages/Products/ProductsDetail";
import DashboardRoot from "../layout/DashboardRoot"; // Admin root
import AdminRoute from "./AdminRoute"; // Admin route guard
import ManageProducts from "../Admin/ManageProducts/ManageProducts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />, // Normal user layout
        errorElement: <Error />,
        children: [
            { path: "/", element: <Home /> },
            { path: "products", element: <Products /> },
            { path: "products/:id", element: <ProductsDetail /> },
            { path: "account", element: <Accounts /> },
        ]
    },
    {
        path: "/admin",
        element: (
            <>
                <DashboardRoot />
            </>
        ),
        errorElement: <Error />,
        children: [
            // Add admin-specific routes here
            { path: "managed-products", element: <ManageProducts /> },
            { path: "accounts", element: <Accounts /> },
        ]
    },
]);

export default router;
