import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux";

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

    const getConcours = (setConcours:Dispatch<SetStateAction<concours[]>>) => {
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/concours/getAll/useful`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async res => {
                const response = await res.json();
                console.log(response);
                setConcours(response.concours);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const {userType} = useAppSelector(state => state.genValues);
    const navigate = useNavigate();
    const postuler = () => {
        if(userType === 'visitor')
        {
            //explain: redirect to login page while passing the current path as a state so that we can redirect the user back to the current path after login
            navigate("/login", {state: { from: '/concours' }});
        }
        else{
            const token = localStorage.getItem('AccessToken');
            if(token )
            {
                //Todo: postuler
                console.log('postuler');
                
            }
        }
    };

    return { getConcours, postuler };
}
 
export default useHelpers;