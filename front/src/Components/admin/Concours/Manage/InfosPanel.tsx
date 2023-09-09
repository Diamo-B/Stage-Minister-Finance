import { UilArrowLeft } from "@iconscout/react-unicons";
import { useAppDispatch, useAppSelector } from "../../../../Hooks/redux";
import AnimatedButton from "../../../FormElements/animatedButton";
import { closeInfo } from "../../../../Redux/Admin/concours/manage";
import {
    UilHeart,
    UilSuitcaseAlt,
    UilUserCheck,
} from "@iconscout/react-unicons";
import { Link } from "react-router-dom";

const InfosPanel = () => {
    const { info } = useAppSelector(state => state.concoursManagement);
    const dispatch = useAppDispatch();
    return (
      <>
        {
          info!== null &&
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
                  {info.status === "enabled" ?
                      <span className="badge badge-success text-white font-bold mt-3">
                          Actif
                      </span>
                      :
                      <span className="badge badge-error text-white font-bold mt-3">
                          Clôturé
                      </span>
                  }
              </div>
              <div className="grid grid-cols-3 flex-grow gap-5 mt-3">
                  <div className="flex flex-col border-4 rounded-xl ">
                      <div className="stats stats-vertical shadow">
                          <div className="stat grid grid-cols-2">
                              <div className="">
                                  <div className="stat-title">Candidats</div>
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
                                  <div className="stat-title">Limite Postes</div>
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
                                  <div className="stat-title">Limite Age</div>
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
                            <h1 className="text-2xl text-base-content font-bold">Branche</h1>
                            {info.branche.label}
                          </div>
                            <div className="divider my-0"></div>
                          <div className="w-full h-full flex flex-col justify-center items-center gap-3">
                            <h1 className="text-2xl text-base-content font-bold">Spécialité</h1>
                            {info.specialite.label}
                          </div>
                      </div>
                  </div>
                  <div className="border-4 rounded-xl">
                      <div className="flex flex-col text-center h-full py-10">
                        <h1 className="text-2xl text-base-content font-bold">Avis</h1>
                        <p className="w-full px-3">Veuillez cliquer pour afficher et/ou télécharger </p>
                        <div className="h-full flex items-center justify-center">
                          <Link to={`${import.meta.env.VITE_BackendBaseUrl.replace('/api/v1','')}${info.avis.path.replace('./public','')}`}>
                            <button className="btn">
                              {info?.avis.path.split("/")[4]}
                            </button>
                          </Link>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
        }
      </>
    );
};

export default InfosPanel;
