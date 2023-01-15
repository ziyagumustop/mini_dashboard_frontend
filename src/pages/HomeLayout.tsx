import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HomeRouter } from "../router";
import Home from "./Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Home />}>
      {" "}
      {HomeRouter.map((e, i) => (
        <Route
          key={i}
          path={e.path}
          element={e.element}
          loader={e.loader ?? null}
        ></Route>
      ))}
    </Route>
  )
);

export default function HomeLayout() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}
