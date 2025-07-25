import { type RouteObject } from "react-router-dom";
import { SignUp } from "../pages/client/auth/signUp";
import { SignIn } from "../pages/client/auth/signIn";
import { Auth } from "../pages/client/auth/auth";
import UrlShort from "../pages/client/url/urlShort";
import { ProtuctedRoute } from "./authRoute/protuctedRoute";
import { PublicRoute } from "./authRoute/publicRoute";
import { RootPage } from "./rootPage";

export const UserRouter: RouteObject[] = [
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "signUp",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },

      {
        path: "signIn",
        element: (
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        ),
      },
    ],
  },

  {
    path: "/url/short",
    element: (
      <ProtuctedRoute>
        <UrlShort />
      </ProtuctedRoute>
    ),
  },

  {
    path: "/",
    element: <RootPage />,
  },
];
