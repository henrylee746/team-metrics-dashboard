import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import App2 from "./App2.jsx";
import "./output.css";
import Data from "./components/Data.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//theme state should be lifted up here

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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
