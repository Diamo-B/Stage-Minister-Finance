import { Dispatch, SetStateAction } from "react";
import { useAppDispatch } from "../../../redux";
import { activateAlert } from "../../../../Redux/alerts";

type genProps = { 
    concoursId: string,
    candidats:any[]|undefined,
    setCandidats:Dispatch<SetStateAction<any[] | undefined>>,
}
type examsCenter = {id:string,nom:string}

type Props = {
    setExamCenters:Dispatch<SetStateAction<examsCenter[] | undefined>>, 
    setCandidatsCitiesDistribution:Dispatch<SetStateAction<{recordId:string, city:{id:string, nom:string}, defaultExamCity:{id:string, nom:string}}[] | undefined>>, 
}

const useHelpers = ({concoursId, candidats, setCandidats}:genProps) => {
    
    const dispatch = useAppDispatch();

    const getConcoursAssignments = ({setExamCenters, setCandidatsCitiesDistribution}:Props) => {
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/concours/examination/getAll/${concoursId}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
            }
        }).then(async res => {
            const response = await res.json();
            
            //explain: this is used to get the concours centers without duplicates
            //? the duplication happens because the concours centers are repeated for each candidat
            const centers = response[0]?.concours.villes;
            const distinctCenters = Array.from(new Set(centers.map((obj: examsCenter) => obj.id))).map(
                (id) => {
                  return centers.find((obj:examsCenter) => obj.id === id);
                }
            );
            setExamCenters(distinctCenters);
            
            //explain: this is used to get an array holding the city of each candidat without duplicates
            const candidatsCities = response.map((x:any)=> {return{recordId:x.id,city:{id:x.candidat.user.ville.id, nom:x.candidat.user.ville.nom}, defaultExamCity:x.villeExamen }});
                
            setCandidatsCitiesDistribution(Array.from(new Set(candidatsCities.map((obj:{recordId:string, city:{id:string, nom:string}, defaultExamCity:{id:string, nom:string}}) => obj.city.id))).map(
                (id) => {
                  return candidatsCities.find((obj:{recordId:string, city:{id:string, nom:string}, defaultExamCity:{id:string, nom:string}}) => obj.city.id === id);
                }
            ))

            //explain: this is used to get an array holding all the candidats so we can use it inside the getCityCandidatsCount function
            setCandidats(response.map((x:any)=> x.candidat));
        }).catch((err)=>{
            console.error(err);
        })    
    }

    //explain: this is used to get the number of candidats in a city
    const getCityCandidatsCount = (cityId: string) => {
        return candidats?.filter(c => c.user.ville.id === cityId).length;
    };

    //explain: this is used to validate the current cities distribution
    const validateCurrentSelection = (newCitiesAssignments:{ CandidatIds: string[]; newCityId: string; }[]) => {
        console.log(newCitiesAssignments);
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/concours/examination/validate/${concoursId}`, {
            method: "PUT",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
            },
            body: JSON.stringify({newCitiesAssignments: newCitiesAssignments})
        }).then(async res => {
            const response = await res.json();
            if((response.status || res.status) in [400,500] )
                throw response.status || res.status;
            else
                dispatch(activateAlert({
                    message: "La distribution des villes a été validée avec succès.",
                    level: 'alert-success'
                }))
        }).catch((err)=>{
            console.error(err);
            dispatch(activateAlert({
                message: "Une erreur s'est produite lors de la validation de la distribution des villes.",
                level: 'alert-error'
            }))
        })
    }

    return {getConcoursAssignments, getCityCandidatsCount, validateCurrentSelection};
}
 
export default useHelpers;