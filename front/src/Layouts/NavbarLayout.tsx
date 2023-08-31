import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useAppSelector } from "../Hooks/redux";
import NeutralNavbar from "./NeutralNavbar";
import RegisterNavbar from "./RegisterNavbar";
import { useEffect } from "react";

const NavbarLayout = () => {
    const { userType } = useAppSelector(state => state.genValues);
    const location = useLocation();
    useEffect(()=>{
        console.log(location.pathname);
    },[])
    return ( 
        <>
            {
                location.pathname === "/register" ?
                    <RegisterNavbar />
                :
                userType &&
                (
                    userType === "candidat" || userType === 'admin' ? 
                        <Navbar /> 
                    :
                        userType === "visitor" ?
                            <NeutralNavbar />
                        :
                            <></>
                )
            }
            <div className="w-full py-10 flex flex-col justify-center items-center">
                <Outlet />
            </div>
        </>
    );
};

export default NavbarLayout;
