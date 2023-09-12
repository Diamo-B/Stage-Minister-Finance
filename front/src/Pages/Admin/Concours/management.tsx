import { useEffect } from "react";
import Table from "../../../Components/admin/Concours/Manage/Table";
import SearchBar from "../../../Components/admin/Concours/Manage/searchBar";
import Stats from "../../../Components/admin/Concours/Manage/stats";
import useHelpers from "../../../Hooks/admin/concours/manage/useHelpers";
import { useAppSelector } from "../../../Hooks/redux";
import InfosPanel from "../../../Components/admin/Concours/Manage/InfosPanel";
import { Link } from "react-router-dom";

const ConcoursManagement = () => {
    const { getConcours } = useHelpers();
    const { info } = useAppSelector(state => state.concoursManagement);
    useEffect(() => {
        getConcours();
    }, []);
    return (
        <div className="flex-grow w-full flex flex-col justify-center">
            <div className="flex justify-center items-center gap-5 mt-5 py-3">
                <SearchBar />
            </div>
            <div className=" w-full grid grid-cols-3 gap-5 p-3">
                <div className="col-span-2 max-h-screen overflow-y-auto bg-base-100 border-4 rounded-2xl">
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
                <div className="flex items-center w-full">
                    <div className="bg-base-100 border-4 rounded-2xl flex flex-col justify-center h-fit gap-5 py-5 w-full">
                        <Stats />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConcoursManagement;
