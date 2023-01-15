
import { createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import { LoginRouter } from "../router";

const router = createBrowserRouter(LoginRouter)

export default function LoginLayout() {

    return (
        <div className="h-screen flex items-center">
            <div className="w-screen flex justify-center" style={{ background: 'linear-gradient(to top, #56e2d7 0%, #58cff1 100%)' }}>
                <RouterProvider router={router}></RouterProvider>
            </div>
        </div>
    )
}
