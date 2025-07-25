import type React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtuctedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/signIn"
        state={{ from: { pathname: location.pathname } }}
        replace
      />
    );
  }

  return <>{children}</>;
};
