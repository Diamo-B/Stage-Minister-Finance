import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import GenAppLayout from "./Layouts/GenAppLayout";
import Register from "./Pages/Candidat/Register";
import Home from "./Pages/Candidat/Home";
import AdminHome from "./Pages/Admin/Home";
import CreateModifyConcours from "./Pages/Admin/Concours/Create_Modify";
import Login from "./Pages/Login";
import NavbarLayout from "./Layouts/NavbarLayout";
import WithAuthCheck from "./Utils/Middlewares/Routes/withAuthCheck";
import ConcoursHome from "./Pages/Home/ConcoursHome";
import ResetPassword from "./Pages/resetPassword";
import ConcoursManagement from "./Pages/Admin/Concours/management";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route element={<GenAppLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                        />

                        <Route
                            element={<WithAuthCheck userTypes={["visitor", 'candidat']} />}
                        >
                            <Route element={<NavbarLayout />}>
                                <Route path="/register" element={<Register />} />
                            </Route>
                        </Route>

                        <Route
                            path="/"
                            element={<WithAuthCheck userTypes={["candidat"]} />}
                        >
                            <Route element={<NavbarLayout />}>
                                <Route index element={<Home />} />
                            </Route>
                        </Route>

                        <Route
                            path="/"
                            element={
                                <WithAuthCheck
                                    userTypes={["candidat", "visitor"]}
                                />
                            }
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
                            element={<WithAuthCheck userTypes={["admin"]} />}
                        >
                            <Route element={<NavbarLayout />}>
                                <Route index element={<AdminHome />} />
                                <Route
                                    path={"/admin/concours/create"}
                                    element={<CreateModifyConcours />}
                                />
                                <Route
                                    path={"/admin/concours"}
                                    element={<ConcoursManagement/>}
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
