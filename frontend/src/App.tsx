import { SignIn } from "./pages/client/auth/signIn";
import { SignUp } from "./pages/client/auth/signUp";
import { Landing } from "./pages/landing";

export const App = () => {
  return (
    <div className="">
      {/* <Landing/> */}
      {/* <SignUp/> */}
      <SignIn/>
    </div>
  );
};
