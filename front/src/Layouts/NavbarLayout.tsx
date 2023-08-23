import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
const NavbarLayout = () => {
    return (
        <>
            <Navbar />
            <div className="w-full py-10 flex flex-col justify-center items-center">
                <Outlet />
            </div>
        </>
    );
};

export default NavbarLayout;
