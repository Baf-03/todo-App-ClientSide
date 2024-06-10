import { Route, Routes } from "react-router-dom";
import Todo from "./Pages/Todo";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import ProtectedRoute from "./Routes/ProtectedRoute";
import AuthRoute from "./Routes/authRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <>
    {/* Same as */}
<ToastContainer />
    <Routes>
      <Route element={<AuthRoute/>}>
      <Route path="/auth/login" element={<Login />} />

<Route path="/auth/register" element={<Signup />} />
      </Route>
      

      <Route element={<ProtectedRoute />}>
        <Route index element={<Todo />} />
      </Route>
    </Routes>
    </>
  );
};

export default App;
