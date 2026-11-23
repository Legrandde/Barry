import { lazy, Suspense, type ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Article from "../pages/Articles";
import InternetLink from "../component/forms/InternetLink";
import SmartStore from "../pages/SmartStore";
import Dashbord from "../pages/Dashbord";
import Portfolio from "../pages/Portfofio";
import DetailProject from "../component/DetailProject";
import { ContentProvider } from "../contexts/ContentContext";

function lazyPage(load: () => Promise<{ default: ComponentType }>) {
  const Page = lazy(load);
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">Chargement...</div>}>
      <Page />
    </Suspense>
  );
}

export const Router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ContentProvider>
        <Portfolio />
      </ContentProvider>
    ),
  },
  {
    path: "/Blog/article/:id",
    element: <Article />,
  },
  {
    path: "/internet-link",
    element: <InternetLink />,
  },
  {
    path: "/smartStore",
    element: <SmartStore />,
  },
  {
    path: "/smartStore/dashbord",
    element: <Dashbord />,
  },
  {
    path: "/detaille",
    element: <DetailProject />,
  },
  {
    element: lazyPage(() => import("../pages/admin/AdminRoot")),
    children: [
      {
        path: "/admin/login",
        element: lazyPage(() => import("../pages/admin/AdminLogin")),
      },
      {
        path: "/admin",
        element: lazyPage(() => import("../pages/admin/AdminLayout")),
        children: [
          { index: true, element: lazyPage(() => import("../pages/admin/AdminDashboard")) },
          { path: "sections/:key", element: lazyPage(() => import("../pages/admin/SectionEditor")) },
          { path: "collections/:collection", element: lazyPage(() => import("../pages/admin/CollectionManager")) },
          { path: "messages", element: lazyPage(() => import("../pages/admin/Messages")) },
          { path: "media", element: lazyPage(() => import("../pages/admin/MediaLibrary")) },
          { path: "compte", element: lazyPage(() => import("../pages/admin/AdminAccount")) },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
