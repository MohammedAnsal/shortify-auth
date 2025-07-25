import { createBrowserRouter } from "react-router-dom";
import { UserRouter } from "./userRouter";

const MainRouter = createBrowserRouter([...UserRouter]);

export default MainRouter;
