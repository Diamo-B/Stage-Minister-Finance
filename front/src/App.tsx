import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import GenAppLayout from "./Layouts/GenAppLayout";
import Register from "./Pages/Candidat/Register";
import Home from "./Pages/Candidat/Home";
import AdminHome from "./Pages/Admin/Home";
import CreateConcours from "./Pages/Admin/Concours/Create";
import Login from "./Pages/Login";
import NavbarLayout from "./Layouts/NavbarLayout";
import RouteOutlet from "./Utils/Middlewares/Routes/RouteOutlet";
import ConcoursHome from "./Pages/Home/ConcoursHome";
import ResetPassword from "./Pages/resetPassword";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route element={<GenAppLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                        />

                        <Route
                            path="/"
                            element={<RouteOutlet userTypes={["candidat"]} />}
                        >
                            <Route element={<NavbarLayout />}>
                                <Route index element={<Home />} />
                            </Route>
                        </Route>

                        <Route
                            path="/"
                            element={<RouteOutlet userTypes={["candidat",'visitor']} />}
                        >
                            <Route element={<NavbarLayout />}>
                                <Route
                                    path="/concours"
                                    element={<ConcoursHome />}
                                />
                            </Route>
                        </Route>

                        <Route
                            path="/admin"
                            element={<RouteOutlet userTypes={["admin"]} />}
                        >
                            <Route element={<NavbarLayout />}>
                                <Route index element={<AdminHome />} />
                                <Route
                                    path={"/admin/concours"}
                                    element={<CreateConcours />}
                                />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;
