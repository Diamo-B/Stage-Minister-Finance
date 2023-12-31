import { useEffect } from "react";
import Table from "../../../Components/admin/Concours/Manage/Table";
import SearchBar from "../../../Components/admin/Concours/Manage/searchBar";
//import Stats from "../../../Components/admin/Concours/Manage/stats";
import useHelpers from "../../../Hooks/admin/concours/manage/useHelpers";
import { useAppDispatch, useAppSelector } from "../../../Hooks/redux";
import InfosPanel from "../../../Components/admin/Concours/Manage/InfosPanel";
import { Link, useLocation } from "react-router-dom";
import Toast from "../../../Components/toast";
import { activateAlert } from "../../../Redux/alerts";

const ConcoursManagement = () => {
    const { getConcours } = useHelpers();
    const { alert } = useAppSelector(state => state.alert);
    const { info } = useAppSelector(state => state.concoursManagement);
    useEffect(() => {
        getConcours();
    }, []);
    const location = useLocation()
    const dispatch = useAppDispatch();
    useEffect(()=>{
        console.log(location.state);
        if(location.state?.message && location.state?.type){
            dispatch(activateAlert({
                message: location.state.message,
                level: location.state.type
            }))
        }
    },[location])
    return (
        <div className="flex-grow w-5/6 flex flex-col justify-center ">
            <div className="flex justify-center items-center gap-5 mt-5 py-3">
                <SearchBar />
            </div>
            <div className=" w-full p-3">
                <div className="max-h-screen overflow-y-auto bg-base-100 border-4 rounded-2xl">
                    {info !== null ? (
                        <InfosPanel />
                    ) : (
                        <div className="h-full flex flex-col ">
                            <Table />
                            <div className="flex-grow"></div>
                            <div className="w-full flex justify-center items-center pb-5">
                                <button className="btn btn-sm btn-outline btn-success hover:!text-white mt-7">
                                    <Link
                                        to={"/admin/concours/create"}
                                    >
                                        Créer un nouvel concours
                                    </Link>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {
                    alert.status &&
                    <Toast />
                }
                {/* <div className="flex items-center w-full">
                    <div className="bg-base-100 border-4 rounded-2xl flex flex-col justify-center h-fit gap-5 py-5 w-full">
                        <Stats />
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default ConcoursManagement;
