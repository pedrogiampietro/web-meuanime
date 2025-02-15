import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Series } from "../pages/Series";
import { Movies } from "../pages/Movies";
import { Favorites } from "../pages/Favorites";
import { AnimeDetails } from "../pages/AnimeDetails";
import { App } from "../App";

function ErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zax-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
        <p className="text-zax-text mb-8">
          Desculpe, não conseguimos encontrar o que você está procurando.
        </p>
        <a
          href="/"
          className="bg-zax-primary text-white px-6 py-3 rounded-lg hover:bg-zax-primary/90 transition-colors"
        >
          Voltar para Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/anime/:slug",
        element: <AnimeDetails />,
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
