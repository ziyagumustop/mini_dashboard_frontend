import { createBrowserRouter, Navigate } from "react-router-dom";
import Companies from "./pages/Companies";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Register from "./pages/Register";


export const HomeRouter: Array<{ path: string, element: any, loader?: any }> = [
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />
    },
    {
        path: '/dashboard',
        element: <Dashboard />,

    },
    {
        path: '/companies',
        element: <Companies />,
    },
    {
        path: '/products',
        element: <Products />,
    },
    {
        path: '*',
        element: <Navigate to="/dashboard" replace />
    },

]

export const LoginRouter: Array<{ path: string, element: any, sidebar: Boolean, permission: string }> = [
    {
        path: '/',
        element: <Login />,
        sidebar: true,
        permission: 'all',
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
        sidebar: true,
        permission: 'all',
    },
    {
        path: '/register',
        element: <Register />,
        sidebar: true,
        permission: 'all',
    }
]

export const LoginRoutes = createBrowserRouter(LoginRouter.map((e) => {
    return {
        path: e.path,
        element: e.element
    }
}));

