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

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    <Route element={<GenAppLayout/>}>
                        <Route path="/login" element={<Login/>}/>
                        <Route element={<NavbarLayout />}>
                            <Route index element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/admin">
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
