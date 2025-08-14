import { type RouteObject } from "react-router-dom";
import { SignUp } from "../pages/client/auth/signUp";
import { SignIn } from "../pages/client/auth/signIn";
import { Auth } from "../pages/client/auth/auth";
import VerifyEmail from "../pages/client/auth/verifyEmail";
import UrlShort from "../pages/client/url/urlShort";
import { ProtuctedRoute } from "./authRoute/protuctedRoute";
import { PublicRoute } from "./authRoute/publicRoute";
import { RootPage } from "./rootPage";
import UrlHistory from "../components/urlHistory";

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
    path: "/verify-email",
    element: <VerifyEmail />,
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
    path: "/url/history",
    element: (
      <ProtuctedRoute>
        <UrlHistory />
      </ProtuctedRoute>
    ),
  },

  {
    path: "/",
    element: <RootPage />,
  },
];
