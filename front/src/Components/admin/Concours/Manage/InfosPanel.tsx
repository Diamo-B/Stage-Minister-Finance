import { UilArrowLeft } from "@iconscout/react-unicons";
import { useAppDispatch, useAppSelector } from "../../../../Hooks/redux";
import AnimatedButton from "../../../FormElements/animatedButton";
import { closeInfo } from "../../../../Redux/Admin/concours/manage";
import { CSVLink } from "react-csv";
import {
    UilHeart,
    UilSuitcaseAlt,
    UilUserCheck,
} from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const InfosPanel = () => {
    const { info } = useAppSelector(state => state.concoursManagement);
    const dispatch = useAppDispatch();
    const [dataToExport, setDataToExport] = useState<any[]>([]);
    useEffect(() => {
        if(info !== null && dataToExport.length === 0){
            console.log(info);
            
            const data = info.candidats.map(c=>{
                return {
                    "CIN": c.user.cin,
                    "Titre": c.user.titre,
                    "Nom": c.user.nom,
                    "Prénom": c.user.prenom,
                    "Email": c.user.email,
                    "Adresse": c.user.adresse,
                    "dateNaissance": dayjs(c.user.dateNaissance).format('DD/MM/YYYY'),
                    "telephone": `'${c.user.telephone}`,
                }
            })
            setDataToExport(data);
        }
    },[info])
        
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
                            <span className="badge badge-success text-white font-bold mt-3">
                                Actif
                            </span>
                        ) : (
                            <span className="badge badge-error text-white font-bold mt-3">
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
                            <div className="flex flex-col w-full justify-center items-center h-full">
                                <div className="w-full h-full flex flex-col justify-center items-center gap-3">
                                    <h1 className="text-2xl text-base-content font-bold">
                                        Branche
                                    </h1>
                                    {info.branche.label}
                                </div>
                                <div className="divider my-0"></div>
                                <div className="w-full h-full flex flex-col justify-center items-center gap-3">
                                    <h1 className="text-2xl text-base-content font-bold">
                                        Spécialité
                                    </h1>
                                    {info.specialite.label}
                                </div>
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
                                        <Link
                                            to={`${import.meta.env.VITE_BackendBaseUrl.replace(
                                                "/api/v1",
                                                "",
                                            )}${info.avis.path.replace(
                                                "./public",
                                                "",
                                            )}`}
                                        >
                                            <button className="btn">
                                                {info?.avis.path.split("/")[4]}
                                            </button>
                                        </Link>
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
                                        <button className="btn">
                                            <CSVLink
                                                separator={";"}
                                                data={dataToExport}        
                                                filename={`${info.label}.csv`}
                                                className="btn"
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
        </>
    );
};

export default InfosPanel;
