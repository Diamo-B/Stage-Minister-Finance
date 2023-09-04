import { UilCheck, UilFileDownload } from "@iconscout/react-unicons";
import AnimatedButton from "../../../Components/FormElements/animatedButton";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useHelpers, { concours } from "../../../Hooks/Home/useHelpers";
import { useAppDispatch, useAppSelector } from "../../../Hooks/redux";
import { hidePostuler, showPostuler } from "../../../Redux/Concours/postuler";
import { z } from "zod";

const LatestConcoursTable = () => {
    const dispatch = useAppDispatch();
    const { getConcours, postuler, showPanel_redirect } = useHelpers();
    const [concours, setConcours] = useState<concours[]>([]);
    const { loading } = useAppSelector(state => state.loading);
    const { show, concoursTitle } = useAppSelector(state => state.postuler);
    useEffect(() => {
        getConcours(setConcours);
    }, []);

    /*
        explain: this checks whether the user has already selected a concours to apply for. 
        .e.g: A visitor has selected a concours to apply for, but he/she has not yet signedIn/registered.
        .e.g: So, when he/she signs in, we will redirect him/her to the concours page.
        .e.g: This is the behavior that we have already implemented. But before redirecting the user to the login/register page, we need to ask him/her whether he/she really wants to apply for the selected concours.
        .e.g: We create a state using the useNavigate holding a key named concoursChoisi holding the Id of the chosen concours.
        ! Inside this useEffect we check whether the concoursChoisi key exists in the state. If it does, we show the confirmation panel of that particular concours.
    */
    const location = useLocation();
    useEffect(()=>{
        if(concours)
        {
            const chosenConcoursId =  location.state?.concoursChoisi;
            console.log('concours choisi:', chosenConcoursId);
            
            const schema = z.string().uuid().nonempty();
            if(schema.safeParse(chosenConcoursId).success)
            {
                console.log('hi');
                
                const chosenConcours = concours.find(c => c.id === chosenConcoursId);
                console.log(chosenConcours);
                
                if(chosenConcours !== undefined)
                {   
                    dispatch(showPostuler({
                        concoursId: chosenConcoursId,
                        concoursTitle: chosenConcours.label,
                    }))
                }
            }
        }
    },[concours])

    return (
        <section className="max-h-60 overflow-y-auto rounded-lg">
            <div className="relative">
                <table className="table">
                    <thead className="sticky top-0 z-10 bg-white text-center">
                        <tr>
                            <th className="text-left">
                                Concours de recrutement
                            </th>
                            <th>Avis</th>
                            <th>Date du concours</th>
                            <th>Limite depot du dossier</th>
                            <th>Nombre de postes</th>
                            <th>Limite d'age</th>
                            <th>statut</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {concours && concours.length > 0 ? (
                            concours.map(c => (
                                <tr className="hover" key={c.id}>
                                    <td className="text-left font-bold">
                                        {c.label}
                                    </td>
                                    <td>
                                        <Link
                                            to={`${import.meta.env.VITE_BackendBaseUrl.replace(
                                                "/api/v1",
                                                "",
                                            )}${c.avis.path.replace(
                                                "./public",
                                                "",
                                            )}`}
                                            download={true}
                                        >
                                            <AnimatedButton
                                                Icon={() => (
                                                    <UilFileDownload className="mx-auto w-7 h-7 text-slate-400" />
                                                )}
                                                customButtonClasses={[
                                                    "!m-0",
                                                    "!w-24",
                                                    "btn-outline",
                                                    "border-slate-400",
                                                    "btn-sm",
                                                    "text-xs",
                                                    "font-medium",
                                                    "w-full",
                                                    "border-2",
                                                    "hover:!border-2",
                                                    "hover:border-slate-400",
                                                    "hover:bg-slate-400",
                                                ]}
                                                text="Télécharger"
                                            />
                                        </Link>
                                    </td>
                                    <td>{c.dateConcours}</td>
                                    <td>{c.dateLimiteInscription}</td>
                                    <td>{c.limitePlaces}</td>
                                    <td>{c.limiteAge}</td>
                                    <td>
                                        {c.status === "enabled"
                                            ? "Actif"
                                            : "cloturé"}
                                    </td>
                                    <td className="">
                                        <AnimatedButton
                                            Icon={() => (
                                                <UilCheck className="mx-auto w-7 h-7 text-white" />
                                            )}
                                            customButtonClasses={[
                                                "!m-0",
                                                "!w-24",
                                                "btn-outline",
                                                "btn-success",
                                                "btn-sm",
                                                "text-xs",
                                                "font-bold",
                                                "w-full",
                                                "border-2",
                                                "hover:!border-2",
                                            ]}
                                            text="Postuler"
                                            onClickFct={() =>
                                                showPanel_redirect(
                                                    c.id,
                                                    c.label,
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center">
                                    {loading ? (
                                        <span className="loading loading-spinner loading-md"></span>
                                    ) : (
                                        <p className="my-5 font-medium capitalize text-lg text-neutral">
                                            Aucun concours disponible
                                        </p>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {
                show ? (
                <div className="fixed top-0 left-0 h-screen w-full z-50 flex justify-center items-center bg-slate-700/40">
                    <div className="2xl:w-1/3 lg:w-2/4 bg-white rounded-lg text-center py-7 px-20 flex flex-col gap-5">
                        <p className="text-lg">
                            Voulez-vous vraiment postuler à ce concours ?
                        </p>
                        <h1 className="font-bold text-lg">{concoursTitle}</h1>
                        <div className="w-full flex justify-evenly items-center">
                            <button className="btn btn-outline btn-error w-28 hover:!text-white"
                                onClick={()=>{
                                    dispatch(hidePostuler())
                                }}
                            >
                                Annuler
                            </button>
                            <button className="btn btn-outline btn-success w-28 hover:!text-white"
                                onClick={postuler}
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )
            }
        </section>
    );
};

export default LatestConcoursTable;
