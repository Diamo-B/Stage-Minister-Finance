import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux";
import { startLoading, stopLoading } from "../../Redux/loading";
import { showPostuler } from "../../Redux/Concours/postuler";

export type concours = {
    id: string;
    label: string;
    limiteAge: number;
    limitePlaces: number;
    status: string;
    datePublication: string;
    dateLimiteInscription: string;
    dateConcours: string;
    campagneId: string;
    avis: {path: string};
}

const useHelpers = () => {
    const dispatch = useAppDispatch();

    const getConcours = (setConcours:Dispatch<SetStateAction<concours[]>>) => {
        dispatch(startLoading());
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/concours/getAll/useful`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async res => {
                const response = await res.json();
                setConcours(response.concours);
            })
            .catch(err => {
                console.error(err);
            }).finally(()=>{
                dispatch(stopLoading())
            })
    };

    const getConcoursResults = () => {
        
    }

    const {connectedUser} = useAppSelector(state => state.genValues);
    const navigate = useNavigate();

    const showPanel_redirect = (id: string, title: string) => {
        if (connectedUser === "visitor") {
            //explain: redirect to login page while passing the current path as a state so that we can redirect the user back to the current path after login
            navigate("/login", { state: { from: "/concours", concoursChoisi: id } });
        } else {
            const token = localStorage.getItem("AccessToken");
            if (token) {
                //explain: shows the confirmation panel
                dispatch(showPostuler({
                    concoursId: id,
                    concoursTitle: title,
                }))
            }
        }
    }

    const { concoursId } = useAppSelector(state => state.postuler);
    const postuler = () => {
        console.log(concoursId);
    };

    return { getConcours, postuler, showPanel_redirect, getConcoursResults };
}
 
export default useHelpers;