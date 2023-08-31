import { Dispatch, SetStateAction } from "react";
import { IFormType } from "../../../Utils/interfaces/Admin/concours/IFormTypes";

type loadFetchProps = {
    setDirections: Dispatch<SetStateAction<IFormType[]>>;
    setPostes: Dispatch<SetStateAction<IFormType[]>>;
    setGrades: Dispatch<SetStateAction<IFormType[]>>;
    setBranches: Dispatch<SetStateAction<IFormType[]>>;
    setSpecs: Dispatch<SetStateAction<IFormType[]>>;
};
const useHelpers = ({
    setDirections,
    setPostes,
    setGrades,
    setBranches,
    setSpecs,
}: loadFetchProps) => {
    const fetchOnLoad = () => {
        //* step1: fetch directions
        fetch(
            `${import.meta.env.VITE_BackendBaseUrl}/directions/getAll`,
            {
                method: "GET",
            },
        )
            .then(async res => {
                const response = await res.json();
                setDirections(response);
            })
            .catch(async err => {
                console.error(err);
            });

        //* step2: fetch postes
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/postes/getAll`, {
            method: "GET",
        })
            .then(async res => {
                const response = await res.json();
                setPostes(response);
            })
            .catch(async err => {
                console.error(err);
            });

        //* step3: fetch grades
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/grades/getAll`, {
            method: "GET",
        })
            .then(async res => {
                const response = await res.json();
                setGrades(response);
            })
            .catch(async err => {
                console.error(err);
            });

        //* step4: fetch branches
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/branches/getAll`, {
            method: "GET",
        })
            .then(async res => {
                const response = await res.json();
                setBranches(response);
            })
            .catch(async err => {
                console.error(err);
            });

        //* step5: fetch specialites
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/specs/getAll`, {
            method: "GET",
        })
            .then(async res => {
                const response = await res.json();
                setSpecs(response);
            })
            .catch(async err => {
                console.error(err);
            });
    };

    return {
        fetchOnLoad,
    };
};
 
export default useHelpers;