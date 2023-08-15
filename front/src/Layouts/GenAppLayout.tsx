import GenPageloader from "../Components/GenPageLoading";
import { useAppSelector } from "../hooks/redux";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const GenAppLayout = () => {
    const { GenPageloading } = useAppSelector(state => state.loading);
    return (
        <>
            {GenPageloading && <GenPageloader />}
            <Navbar />
            <div className="min-h-screen p-10 bg-base-200 flex flex-col items-center">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default GenAppLayout;
