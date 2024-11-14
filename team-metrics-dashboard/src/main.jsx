import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import App2 from "./App2.jsx";
import App3 from "./App3.jsx";
import "./output.css";
import Data from "./components/Data.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: ":index", // Dynamic route parameter for index
        element: <Data />,
      },
    ],
  },
  {
    path: "/team",
    element: <App2 />,
    children: [
      {
        path: ":index", // Dynamic route parameter for index
        element: <Data />,
      },
    ],
  },
  {
    path: "/leadtime",
    element: <App3 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
