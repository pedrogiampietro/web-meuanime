import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Series } from "../pages/Series";
import { Movies } from "../pages/Movies";
import { Favorites } from "../pages/Favorites";
import { App } from "../App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/series",
        element: <Series />,
      },
      {
        path: "/filmes",
        element: <Movies />,
      },
      {
        path: "/favoritos",
        element: <Favorites />,
      },
    ],
  },
]);
