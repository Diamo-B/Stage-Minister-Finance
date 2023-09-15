import { UilArrowLeft } from "@iconscout/react-unicons";
import { useAppDispatch, useAppSelector } from "../../../../Hooks/redux";
import AnimatedButton from "../../../FormElements/animatedButton";
import { EndConcours, closeInfo } from "../../../../Redux/Admin/concours/manage";
import { CSVLink } from "react-csv";
import {
    UilHeart,
    UilSuitcaseAlt,
    UilUserCheck,
} from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import ConfirmationPanel from "../../../FormElements/confirmationPanel";
import { hideConfirmationPanel, showConfirmationPanel } from "../../../../Redux/confirmationPanel";
import { startLoading, stopLoading } from "../../../../Redux/loading";
import { activateAlert } from "../../../../Redux/alerts";

const InfosPanel = () => {
    const dispatch = useAppDispatch();
    const { info } = useAppSelector(state => state.concoursManagement);

    //explain: this will hold the id of each candidat alongside his exam city
    const [candidatsExamCities, setCandidatsExamCities] = useState<{candidatId:string, examCenterName:string}[]>([]);
    useEffect(()=>{
        if(info!== null)
        {
            const concoursId = info.id;
            //explain: this will fetch the concours exam centers for each candidat
            fetch(`${import.meta.env.VITE_BackendBaseUrl}/concours/examination/getAll/${concoursId}`, {
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
                }
            }).then(async res => {
                const response  = await res.json();
                setCandidatsExamCities(
                    response.map((x:any)=> {return{candidatId:x.candidat.id, examCenterName:x.villeExamen.nom}})
                )
            }).catch((err)=>{
                console.error(err);
            })
        }
    },[info])

    //explain: Setting the candidats data export to CSV
    const [dataToExport, setDataToExport] = useState<any[]>([]);
    
    useEffect(() => {
        if(candidatsExamCities.length>0 && info !== null && dataToExport.length === 0){
            const data =info.candidats.map(c=>{
                const centreExamen = candidatsExamCities.find(x=>x.candidatId === c.id)!!.examCenterName;
                return {
                    "CIN": c.user.cin,
                    "Titre": c.user.titre,
                    "Nom": c.user.nom,
                    "Prénom": c.user.prenom,
                    "Email": c.user.email,
                    "Adresse": c.user.adresse,
                    "dateNaissance": dayjs(c.user.dateNaissance).format('DD/MM/YYYY'),
                    "telephone": `'${c.user.telephone}`,
                    "centre_d'examen": centreExamen,
                }
            })
            setDataToExport(data);
        }
    },[candidatsExamCities])

    //explain: Setting the behavior of the action 'Cloturer concours'
    const {show, isConfirmed, functionParams} = useAppSelector(state=>state.confirmationPanel)
    useEffect(()=>{
        if(isConfirmed){
            dispatch(startLoading())
            //explain: Close the concours with the id present inside the functionParams
            fetch(`${import.meta.env.VITE_BackendBaseUrl}/concours/end`,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    Authorization: 'Bearer '+localStorage.getItem('AccessToken')
                },
                body: JSON.stringify({
                    id: functionParams
                })
            }).then(async(res)=>{
                const response = await res.json();
                if(response.errors)
                {
                    throw response.errors;
                }
                else
                {
                    dispatch(EndConcours(functionParams))
                    dispatch(activateAlert({
                        message: "Le concours a été Clôturé avec succès",
                        level:"alert-success"
                    }))
                }
            }).catch(err=>{
                dispatch(activateAlert({
                    message: "Une erreur inattendue s'est produite.",
                    level:"alert-error"
                }))
                console.error('err',err);
            })
            .finally(()=>{
                dispatch(stopLoading())
                //! Hide the confirmation panel. If this is not done after removing the record, be ready for some nasty bugs, since the isConfirmed will keep being true and it will launch the suppression api whenever the page re-renders.
                dispatch(hideConfirmationPanel());
                dispatch(closeInfo());
            })
        }
    },[isConfirmed])
        
    return (
        <>
            {info !== null && (
                <div className="h-full py-5 px-5">
                    <AnimatedButton
                        Icon={() => <UilArrowLeft className="!text-neutral" />}
                        text="Retour"
                        ReverseAnimationDirection
                        customButtonClasses={[
                            "btn-outline",
                            "btn-xs",
                            "border-2",
                            "hover:!border-2",
                        ]}
                        onClickFct={() => {
                            dispatch(closeInfo());
                        }}
                    />
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="font-bold">{info.label}</h1>
                        {info.status === "enabled" ? (
                            <span className="badge badge-lg badge-success text-white font-bold mt-3 w-28">
                                Actif
                            </span>
                        ) : (
                            <span className="badge badge-error text-white font-bold mt-3 w-28">
                                Clôturé
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-3 flex-grow gap-5 mt-3">
                        <div className="flex flex-col border-4 rounded-xl ">
                            <div className="stats stats-vertical h-full border-0">
                                <div className="stat grid grid-cols-2">
                                    <div className="">
                                        <div className="stat-title">
                                            Candidats
                                        </div>
                                        <div className="stat-value">
                                            {info.candidats.length}
                                        </div>
                                    </div>
                                    <div className="flex justify-end ">
                                        <UilUserCheck className="h-full w-9" />
                                    </div>
                                </div>

                                <div className="stat grid grid-cols-2">
                                    <div className="">
                                        <div className="stat-title">
                                            Limite Postes
                                        </div>
                                        <div className="stat-value">
                                            {info.limitePlaces}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <UilSuitcaseAlt className="h-full w-9" />
                                    </div>
                                </div>

                                <div className="stat grid grid-cols-2">
                                    <div className="">
                                        <div className="stat-title">
                                            Limite Age
                                        </div>
                                        <div className="stat-value">
                                            {info.limiteAge}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <UilHeart className="h-full w-9" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-4 rounded-xl">
                            <div className="grid grid-cols-2 w-full justify-center items-center h-full">
                                <div className="w-full h-full flex flex-col justify-center items-center gap-3 border-r-2 ">
                                    <h1 className="text-2xl text-base-content font-bold">
                                        Branche
                                    </h1>
                                    {info.branche.label}
                                </div>
                                <div className="w-full h-full flex flex-col justify-center items-center gap-3 border-l-2">
                                    <h1 className="text-2xl text-base-content font-bold">
                                        Spécialité
                                    </h1>
                                    {info.specialite.label}
                                </div>
                                
                                    {
                                        info.status === 'enabled'?
                                        <div className="col-span-2 border-t-4 h-full py-5 px-10 grid grid-cols-1 items-center place-items-center">
                                            <h1 className="text-2xl text-base-content font-bold mb-1">
                                                Clôturer le concours
                                            </h1>
                                            <p>Veuillez noter que la clôture de ce concours empêchera les candidats de postuler à l'avenir.</p>
                                            <button className="btn btn-wide btn-outline btn-error hover:!text-white"
                                                onClick={()=>{
                                                    dispatch(showConfirmationPanel({
                                                        text: 'Voulez-vous vraiment clôturer ce concours ?\n Cette action est irréversible.',
                                                        functionParams: info.id,
                                                        itemIdentifier: info.label,
                                                    }))
                                                }}
                                            >
                                                Clôturer
                                            </button>
                                        </div>
                                        :
                                            info.status === 'ended'&&
                                                <div className=" border-t-4 rounded-b-lg h-full py-5 px-10 col-span-2 relative bg-slate-700/50 text-base-300 flex flex-col justify-center items-center">
                                                    <p className="capitalize text-xl font-bold">Vous avez clôturé ce concours!!</p>
                                                    <p className="text-xl font-bold">Cette action est irréversible.</p> 
                                                </div>
                                    }
                            </div>
                        </div>
                        <div className="border-4 rounded-xl">
                            <div className="flex flex-col w-full h-full border-opacity-50 py-10">
                                <div className="grid h-1/2">
                                <div className="grid grid-cols-1 grid-rows-2 text-center h-full"> 
                                    <h1 className="text-2xl text-base-content font-bold">
                                        Avis
                                    </h1>
                                    <div className="h-full flex justify-center">
                                        <button className="btn max-w-xs">
                                            <Link
                                                to={`${import.meta.env.VITE_BackendBaseUrl.replace(
                                                    "/api/v1",
                                                    "",
                                                )}${info.avis.path.replace(
                                                    "./public",
                                                    "",
                                                )}`}
                                            >
                                                    {info?.avis.path.split("/")[4]}
                                            </Link>
                                        </button>
                                    </div>
                                </div>

                                <div className=""></div>
                                </div>
                                <div className="divider">OR</div>
                                <div className="grid h-1/2 text-center gap-1">
                                    <h1 className="text-2xl text-base-content font-bold ">
                                        Candidats
                                    </h1>
                                    <div className="h-full flex justify-center">
                                        <button className={`btn max-w-xs ${info.candidats.length === 0 ? 'btn-disabled' : ''}`}>
                                            <CSVLink
                                                separator={";"}
                                                data={dataToExport}        
                                                filename={`${info.label}.csv`}
                                            >
                                                infos_Candidats.csv
                                            </CSVLink>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {
                show &&
                <ConfirmationPanel customConfirmButton="Clôturer"/>
            }
        </>
    );
};

export default InfosPanel;
