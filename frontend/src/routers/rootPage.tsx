import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { ProtuctedRoute } from "./authRoute/protuctedRoute";
import UrlShort from "../pages/client/url/urlShort";
import { Landing } from "../pages/landing";

export const RootPage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  return isAuthenticated ? (
    <ProtuctedRoute>
      <UrlShort />
    </ProtuctedRoute>
  ) : (
    <Landing />
  );
};
