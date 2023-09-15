import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimatedButton from "../../../Components/FormElements/animatedButton";
import { UilArrowLeft, UilArrowRight } from "@iconscout/react-unicons";
import useHelpers from "../../../Hooks/admin/concours/categorize/useHelpers";
import Toast from "../../../Components/toast";
import { useAppSelector } from "../../../Hooks/redux";

type examsCenter = {id:string,nom:string}

const CategorizeConcours = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {alert} = useAppSelector(state => state.alert)

    const [examCenters, setExamCenters] = useState<examsCenter[]>();
    const [candidatsCitiesDistribution, setCandidatsCitiesDistribution] = useState<{recordId:string, city:{id:string, nom:string}, defaultExamCity:{id:string, nom:string}}[]>();
    const [candidats, setCandidats] = useState<any[]>();
    const { getConcoursAssignments, getCityCandidatsCount, validateCurrentSelection } = useHelpers({concoursId: location.state.concoursId,candidats, setCandidats});
    
    useEffect(() => {
        if (location.state.concoursId) {
            getConcoursAssignments({setExamCenters,setCandidatsCitiesDistribution})
        }
    }, []);

    //explain: this will hold the id of each ville_examen_candidat alongside the id of the new city it should be assigned to
    const [newCitiesAssignments, setNewCitiesAssignments] = useState<{CandidatIds:string[], newCityId:string}[]>([]);
    
    //explain: when a user selects a new city for a ville_examen_candidat, this function will be called to update the newCitiesAssignments array. it will check the array for the recordId and if it exists it will update the newCityId, if it doesn't exist it will add a new record to the array

    const activate = (e: ChangeEvent <HTMLSelectElement> ,record:{recordId:string, city:{id:string, nom:string}, defaultExamCity:{id:string, nom:string}}) => {
        //explain: get the new exam city id from the select element
        const newExamCityId = e.target.value;
        
        const defaultExamCityId = record.defaultExamCity.id;

        //explain: check if the new exam city id is equal to the default exam city id, if it is then do not add the record
        if(newExamCityId === defaultExamCityId) {
            return;
        }
        else {
            //explain: get all the candidats with the same city id as the current record
            const candidatsWithSameCityId = candidats?.filter(c => c.user.ville.id === record.city.id);

            //explain: check if the record already exists in the newCitiesAssignments array, if it does then remove it, then add a new record to the array
            const recordIndex = newCitiesAssignments.findIndex(x => x.newCityId === newExamCityId);
            let newCitiesAssignmentsCopy = [...newCitiesAssignments];
            if(recordIndex > -1) {
                newCitiesAssignmentsCopy.splice(recordIndex,1);
            }
            setNewCitiesAssignments([...newCitiesAssignmentsCopy, {CandidatIds:candidatsWithSameCityId?.map(c => c.id) || [], newCityId:newExamCityId}]);
        }

    };

    return (
        <div className="w-full px-5 flex flex-col justify-center items-center gap-5 py-10 max-h-[34em]">
            <div className="w-5/6 bg-base-100 border-4 border-neutral-content rounded-xl relative overflow-y-auto">
                <table className="table table-lg relative">
                    <thead className="sticky top-0 bg-base-100">
                        <tr>
                            <th className="text-center">Villes</th>
                            <th className="text-center">Nombre Candidats</th>
                            <th className="text-center">Centre d'examen</th>
                        </tr>
                    </thead>
                    <tbody className="font-bold">
                        {candidatsCitiesDistribution &&
                            candidatsCitiesDistribution.map(record => (    
                                <tr className="hover" key={record.city.id}>
                                    <td className="text-center">
                                        <p>{record.city.nom}</p>
                                    </td>
                                    <td className="text-center">
                                        {getCityCandidatsCount(record.city.id)}
                                    </td>
                                    <td className="text-center">
                                        <select className="select select-bordered w-full max-w-xs text-center"
                                            onChange={(e) => activate(e, record)}
                                        >
                                            <option
                                            value={record.defaultExamCity.id}>{record.defaultExamCity.nom}</option>
                                            {
                                                examCenters&& examCenters.length > 0 && examCenters?.map((c:examsCenter) => (
                                                c.id !== record.defaultExamCity.id &&
                                                <option key={c.id} value={c.id}>{c.nom}</option>
                                            ))}
                                            
                                        </select>
                                    </td>
                                </tr>
                            ))}                         
                    </tbody>
                </table>
            </div>
            <div className="w-full flex justify-center gap-20 my-5 ">
                <AnimatedButton
                    Icon={() => <UilArrowLeft className="w-8 h-8 text-white" />}
                    text="Annuler"
                    ReverseAnimationDirection
                    customButtonClasses={[
                        "btn-outline",
                        "btn-wide",
                        "btn-error",
                        "border-2",
                        "hover:!border-2",
                        '!m-0'
                    ]}
                    onClickFct={() => {
                        navigate('/admin/concours');
                    }}
                />

                <AnimatedButton
                    Icon={() => <UilArrowRight className="w-8 h-8 text-white" />}
                    text="Enregistrer"
                    customButtonClasses={[
                        "btn-outline",
                        "btn-wide",
                        "btn-success",
                        "border-2",
                        "hover:!border-2",
                        '!m-0'
                    ]}
                    onClickFct={() => {
                        validateCurrentSelection(newCitiesAssignments)
                    }}
                />
            </div>
            {
                alert.status && <Toast/>
            }
        </div>
    );
};

export default CategorizeConcours;
