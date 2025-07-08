import MainLayout from './../layouts/MainLayout';
import ErrorPage from './../pages/ErrorPage/ErrorPage';
import Home from './../pages/Home/Home';
import Products from './../pages/Products/Products';
import ProductDetails from './../pages/ProductDetails/ProductDetails';
import Login from './../pages/Login/Login';
import PrivateRoute from './PrivateRoute';
import Register from './../pages/Register/Register';
import DashboardLayout from '../layouts/DashboardLayout';
import MyProfile from './../components/dashboard/MyProfile/MyProfile';
import AddProduct from './../components/dashboard/AddProduct/AddProduct';
import MyProducts from './../components/dashboard/MyProducts/MyProducts';
import ModeratorRoute from './ModeratorRoute';
import ProductReviewQueue from './../components/dashboard/moderator/ProductReviewQueue/ProductReviewQueue';
import ReportedContents from './../components/dashboard/moderator/ReportedContents/ReportedContents';
import AdminRoute from './AdminRoute';
import Statistics from './../components/dashboard/admin/Statistics/Statistics';
import ManageUsers from './../components/dashboard/admin/ManageUsers/ManageUsers';
import ManageCoupons from './../components/dashboard/admin/ManageCoupons/ManageCoupons';
import { createBrowserRouter } from 'react-router';


export const router = createBrowserRouter( [
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <Home /> },
            { path: "products", element: <Products /> },
            {
                path: "product/:id",
                element: <PrivateRoute><ProductDetails /></PrivateRoute>,
            },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
        ],
    },
    {
        path: "/dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            // Normal User Routes
            { path: "my-profile", element: <MyProfile /> },
            { path: "add-product", element: <AddProduct /> },
            { path: "my-products", element: <MyProducts /> },
            // Moderator Routes
            {
                path: "product-review-queue",
                element: <ModeratorRoute><ProductReviewQueue /></ModeratorRoute>,
            },
            {
                path: "reported-contents",
                element: <ModeratorRoute><ReportedContents /></ModeratorRoute>,
            },
            // Admin Routes
            { path: "statistics", element: <AdminRoute><Statistics /></AdminRoute> },
            { path: "manage-users", element: <AdminRoute><ManageUsers /></AdminRoute> },
            { path: "manage-coupons", element: <AdminRoute><ManageCoupons /></AdminRoute> },
        ],
    },
] );