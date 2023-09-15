import {
    UilSearch,
    UilSortAmountUp,
    UilSortAmountDown,
    UilCheck,
} from "@iconscout/react-unicons";
import { useAppDispatch, useAppSelector } from "../../../../Hooks/redux";
import { useEffect, useRef, useState } from "react";
import { setFilteredConcours, sortConcours } from "../../../../Redux/Admin/concours/manage";

const SearchBar = () => {
    const { info, concours } = useAppSelector(state => state.concoursManagement);
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const findConcours = () => {
        const value = inputRef.current?.value;
        if (value) {
            dispatch(setFilteredConcours(
                concours.filter(concours => concours.label.toLowerCase().includes(value.toLowerCase()))
            ))
        }
    };
    const [filterType,setFilterType] = useState<'poste'|'grade'|'direction'|'status'|null>(null);
    const [filterOrder,setFilterOrder] = useState<'asc'|'desc'|null>(null);

    useEffect(()=>{
        if (filterOrder !== null && filterType !== null) {
            dispatch(sortConcours({
                type:filterType,
                order:filterOrder
            }))    
        }
    },[filterType,filterOrder])

    const reset = () => {
        dispatch(setFilteredConcours(concours));
        setFilterType(null);
        setFilterOrder(null);
        inputRef.current!.value = '';
    }

    return (
        <div className="w-full">
            <div className="flex justify-between px-10 items-center gap-5">
                <div className="relative w-5/12">
                    <UilSearch className="w-4 absolute top-1 left-2" />
                    <input
                        type="text"
                        className="input input-sm input-bordered w-full pl-8"
                        disabled={info !== null}
                        ref={inputRef}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                findConcours();
                            }
                        }}
                    />
                </div>
                <div className="flex justify-center items-center gap-2">
                    <button className="btn btn-outline btn-xs" disabled={info !== null}
                        onClick={findConcours}
                    >
                        Rechercher
                    </button>
                    <div className="dropdown dropdown-bottom dropdown-left">
                        <button tabIndex={0} 
                        className="btn btn-outline btn-xs" 
                        disabled={info !== null}
                        >
                            Filtrer
                        </button>
                        <ul
                            tabIndex={0}
                            className="dropdown-content border-2 z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            <li onClick={()=>setFilterType("direction")}>
                                <div className="flex justify-between">
                                    <a>Par Direction</a>
                                    {
                                        filterType === "direction" &&
                                        <UilCheck className="text-neutral-content w-7 h-7 font-bold" />
                                    }
                                </div>
                            </li>
                            <li onClick={()=>setFilterType("grade")}>
                                <div className="flex justify-between">
                                    <a>Par Grade</a>
                                    {
                                        filterType === "grade" &&
                                        <UilCheck className="text-neutral-content w-7 h-7 font-bold" />
                                    }
                                </div>
                            </li>
                            <li onClick={()=>setFilterType("poste")}>
                                <div className="flex justify-between">
                                    <a>Par Poste</a>
                                    {
                                        filterType === "poste" &&
                                        <UilCheck className="text-neutral-content w-7 h-7 font-bold" />
                                    }
                                </div>
                            </li>
                            <li onClick={()=>setFilterType("status")}>
                                <div className="flex justify-between">
                                    <a>Par Status</a>
                                    {
                                        filterType === "status" &&
                                        <UilCheck className="text-neutral-content w-7 h-7 font-bold" />
                                    }
                                </div>
                            </li>
                            <div className="mt-3 flex justify-evenly items-center">
                                <button className={`btn btn-xs btn-outline hover:btn-info ${filterOrder === "asc" && "btn-info"}`}
                                    onClick={()=>setFilterOrder("asc")}
                                >
                                    <UilSortAmountUp />
                                </button>
                                <button className={`btn btn-xs btn-outline hover:btn-info ${filterOrder === "desc" && "btn-info"}`}
                                    onClick={()=>setFilterOrder("desc")}
                                >
                                    <UilSortAmountDown />
                                </button>
                            </div>
                        </ul>
                    </div>
                    <button className="btn btn-outline btn-xs" disabled={info !== null}
                    onClick={reset}>Réinitialiser</button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
