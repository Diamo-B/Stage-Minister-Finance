import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAppDispatch, useAppSelector } from "../Hooks/redux";
import NeutralNavbar from "./NeutralNavbar";
import { useEffect } from "react";
import { stopGenPageLoading } from "../Redux/loading";

const NavbarLayout = () => {
    const { connectedUser } = useAppSelector(state => state.genValues);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(stopGenPageLoading());
    }, []);
    return (
        <>
            {connectedUser && typeof connectedUser === "object" ? (
                (connectedUser.candidat !== null ||
                    connectedUser.admin !== null) && <Navbar />
            ) : (
                <NeutralNavbar />
            )}
            <div className="w-full py-10 flex flex-col justify-center items-center">
                <Outlet />
            </div>
        </>
    );
};

export default NavbarLayout;
