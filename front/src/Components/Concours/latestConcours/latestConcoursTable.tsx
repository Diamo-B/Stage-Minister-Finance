import { UilCheck, UilFileDownload, UilTimesCircle } from "@iconscout/react-unicons";
import AnimatedButton from "../../FormElements/animatedButton";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import useHelpers from "../../../Hooks/Home/useHelpers";
import { useAppDispatch, useAppSelector } from "../../../Hooks/redux";
import { hideAlreadyAppliedPanel, hidePanel, showAlreadyAppliedPanel, showPanel } from "../../../Redux/Concours/postuler";
import { connectedUserSchema } from "../../../Redux/types/GeneralValuesTypes";
import { z } from "zod";
import PostulerPanel from "./postulerPanel";

const LatestConcoursTable = () => {
    const dispatch = useAppDispatch();
    const { getConcours, showPanelOrRedirect } = useHelpers();
    const { show, showAlreadyApplied, concoursId, concoursTitle } = useAppSelector(state => state.postuler);
    const { concours } = useAppSelector(state => state.postulerConcours);
    const {connectedUser} = useAppSelector(state => state.genValues);
    const {loading} = useAppSelector(state=>state.loading)

    useEffect(() => {
        if((connectedUser as z.infer<typeof connectedUserSchema>)?.candidat?.id || connectedUser === 'visitor')
            getConcours();
    }, [connectedUser]);

    /*
        explain: this checks whether the user has already selected a concours to apply for. 
        .e.g: A visitor has selected a concours to apply for, but he/she has not yet signedIn/registered.
        .e.g: So, when he/she signs in, we will redirect him/her to the concours page.
        .e.g: This is the behavior that we have already implemented. But before redirecting the user to the login/register page, we need to ask him/her whether he/she really wants to apply for the selected concours.
        ? To do this, before redirecting the user to the login page, we are setting the concoursId and the concoursTitle in the redux store. (in the showPanel_redirect function within the useHelpers hook)
        ! So in this useEffect we check whether the concoursId and the concoursTitle are set in the redux store. If they are set, we search the concours with the same concoursId to see if the user has already applied to it. If that's the case, we show a message indicating the fact that the user has already applied, otherwise we show the confirmation panel.
    */
    useEffect(()=>{
        if(concours && connectedUser)
        {
            if(concoursId && concoursTitle )
            {
                //explain: check if the user has already applied to the selected Concours
                const hasAlreadyApplied = concours
                    .find(c => c.id === concoursId)
                    ?.candidats?.find(
                        c => c.id === (connectedUser as z.infer<typeof connectedUserSchema>).candidat?.id
                    )?.id ? true : false;
                if (hasAlreadyApplied === true)
                {
                    dispatch(hidePanel())
                    dispatch(showAlreadyAppliedPanel()); 
                }
                else
                {
                    dispatch(hideAlreadyAppliedPanel())
                    dispatch(showPanel());
                }
            } 
        }
    },[concours, connectedUser])

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
                        {concours && concours.length > 0 ?
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
                                                c.candidats && c.candidats.length > 0 ?
                                                    <UilTimesCircle className="mx-auto w-7 h-7 text-white" />
                                                :
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
                                                "disabled:!btn-error",
                                                "disabled:!btn-outline",
                                                "disabled:pointer-events-auto",
                                            ]}
                                            text={c.candidats && c.candidats.length > 0 ? "Postulé" : "Postuler"}
                                            disabled={c.candidats && c.candidats.length > 0 ? true: false}
                                            onClickFct={() =>
                                                !(c.candidats && c.candidats.length > 0)
                                                &&
                                                showPanelOrRedirect(
                                                    c.id,
                                                    c.label,
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))
                            :
                            <tr>
                                <td colSpan={8} className="text-center">
                                    {loading ? (
                                        <span className="loading loading-spinner loading-md"></span>
                                    ) : (
                                        <p className="my-5 font-medium text-lg text-neutral">
                                            Aucune annonce pour le moment
                                        </p>
                                    )}
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>

            {
                (show === true || showAlreadyApplied === true) && 
                <PostulerPanel />
            }
        </section>
    );
};

export default LatestConcoursTable;
