import GenPageloader from "../Components/GenPageLoading";
import { useAppSelector } from "../hooks/redux";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
const GenAppLayout = () => {
    const { GenPageloading } = useAppSelector(state => state.loading);
    return (
        <div className="min-h-screen flex flex-col">
            {GenPageloading && <GenPageloader />}
            <div className="bg-base-200 flex-1 flex flex-col items-center">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default GenAppLayout;
