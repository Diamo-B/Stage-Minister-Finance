import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAppSelector } from "../Hooks/redux";
import NeutralNavbar from "./NeutralNavbar";

const NavbarLayout = () => {
    const { connectedUser } = useAppSelector(state => state.genValues);
    return (
        <>
            {connectedUser && typeof connectedUser === "object" ? (
                (connectedUser.candidat !== null ||
                    connectedUser.admin !== null) && <Navbar />
            ) : (
                <NeutralNavbar />
            )}
            <div className="flex-grow w-full flex flex-col justify-center items-center">
                <Outlet />
            </div>
        </>
    );
};

export default NavbarLayout;
