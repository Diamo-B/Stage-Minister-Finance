import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../Hooks/redux";
import { startGenPageLoading, stopGenPageLoading } from "../Redux/loading";
import NeutralNavbar from "./NeutralNavbar";

const NavbarLayout = () => {
    const { userType } = useAppSelector(state => state.genValues);
    const { GenPageloading } = useAppSelector(state => state.loading);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!userType)
            dispatch(startGenPageLoading())
        setTimeout(() => {
            dispatch(stopGenPageLoading())
        }, 3000);
    }, [userType]);

    return (
        <>
            {
                userType === "candidat" || userType === 'admin' ? 
                    <Navbar /> 
                :
                    userType === "visitor" ?
                        <NeutralNavbar />
                    :
                        <></>
            }
            <div className="w-full py-10 flex flex-col justify-center items-center">
                <Outlet />
            </div>
        </>
    );
};

export default NavbarLayout;
