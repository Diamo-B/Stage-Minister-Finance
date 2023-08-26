import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import GenAppLayout from "./Layouts/GenAppLayout";
import Register from "./Pages/Candidat/Register";
import Home from "./Pages/Candidat/Home";
import AdminHome from "./Pages/Admin/Home";
import CreateConcours from "./Pages/Admin/Concours/Create";
import Login from "./Pages/Login";
import NavbarLayout from "./Layouts/NavbarLayout";
import RouteOutlet from "./utils/Middlewares/Routes/CandidatOutlet";
import ConcoursHome from "./Pages/ConcoursHome";
import NeutralNavbar from "./Layouts/NeutralNavbar";
import ResetPassword from "./Pages/resetPassword";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route element={<GenAppLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/reset-password" element={<ResetPassword/>}/>
                        <Route element={<NeutralNavbar/>}>
                            <Route path="/concours" element={<ConcoursHome/>}/>
                        </Route>

                        <Route path="/" element={<RouteOutlet userType="candidat"/>}>
                            <Route element={<NavbarLayout />}>
                                <Route index element={<Home />} />
                            </Route>
                        </Route>

                        <Route path="/admin" element={<RouteOutlet userType="admin"/>}>
                            <Route element={<NavbarLayout />}>
                                <Route index element={<AdminHome />} />
                                <Route
                                    path="/admin/concours/create"
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
