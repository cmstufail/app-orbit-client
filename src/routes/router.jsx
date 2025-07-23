import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ErrorPage from '../components/Shared/ErrorPage';
import Home from '../pages/Home/Home/Home';
import Products from '../pages/Products/ProductsPage';
import ProductDetails from '../pages/Products/ProductDetails';
import Login from '../pages/Auth/Login';
import PrivateRoute from './PrivateRoute';
import Register from '../pages/Auth/Register';
import DashboardLayout from '../layouts/DashboardLayout';
import MyProfile from '../pages/Dashboard/User/MyProfile';
import AddProduct from '../pages/Dashboard/User/AddProduct';
import MyProducts from '../pages/Dashboard/User/MyProducts';
import ProductUpdate from '../pages/Products/ProductUpdate';
import CheckoutPage from '../pages/Payment/CheckoutPage';
import ModeratorRoute from './ModeratorRoute';
import ProductReviewQueue from '../pages/Dashboard/Moderator/ProductReviewQueue';
import ReportedContents from '../pages/Dashboard/Moderator/ReportedContents';
import AdminRoute from './AdminRoute';
import Statistics from '../pages/Dashboard/Admin/Statistics';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import ManageCoupons from '../pages/Dashboard/Admin/ManageCoupons';
import DefaultDashboardView from './../components/Dashboard/DefaultDashboardView';
import AboutUs from '../components/AboutUs';
import Contact from '../components/Contact';


export const router = createBrowserRouter( [
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "products",
                element: <Products />
            },
            {
                path: "product/:id",
                element: (
                    <PrivateRoute>
                        <ProductDetails />
                    </PrivateRoute>
                ),
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "about",
                element: <AboutUs />
            },
            {
                path: "contact",
                element: <Contact />
            },
        ],
    },
    {
        path: "dashboard",
        element: (
            <PrivateRoute> <DashboardLayout /> </PrivateRoute>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <DefaultDashboardView />
            },

            // User Dashboard Routes
            {
                path: "my-profile",
                element: <MyProfile />
            },
            {
                path: "add-product",
                element: <AddProduct />
            },
            {
                path: "my-products",
                element: <MyProducts />
            },
            {
                path: "update-product/:id",
                element: <ProductUpdate />,
            },
            {
                path: "checkout",
                element: <CheckoutPage />,
            },

            // Moderator Dashboard Routes
            {
                path: "product-review-queue",
                element: (
                    <ModeratorRoute>
                        <ProductReviewQueue />
                    </ModeratorRoute>
                ),
            },
            {
                path: "reported-contents",
                element: (
                    <ModeratorRoute>
                        <ReportedContents />
                    </ModeratorRoute>
                ),
            },

            // Admin Dashboard Routes
            {
                path: "statistics",
                element: (
                    <AdminRoute>
                        <Statistics />
                    </AdminRoute>
                )
            },
            {
                path: "manage-users",
                element: (
                    <AdminRoute>
                        <ManageUsers />
                    </AdminRoute>
                )
            },
            {
                path: "manage-coupons",
                element: (
                    <AdminRoute>
                        <ManageCoupons />
                    </AdminRoute>
                )
            },
        ],
    },
], {
    basename: "/"
} );