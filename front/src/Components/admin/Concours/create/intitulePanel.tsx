import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Input from "../../../ReusableForm/input";
import { useFormContext } from "react-hook-form";
import { startLoading } from "../../../../redux/loading";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { UilCheckCircle } from "@iconscout/react-unicons";

type Props = {
    showIntitulePanel: Dispatch<SetStateAction<boolean>>;
    direction: string;
    poste: string;
    grade: string;
    CustomLabelInput: boolean;
    showCustomLabelInput: Dispatch<SetStateAction<boolean>>;
};

const IntitulePanel = ({
    showIntitulePanel,
    direction,
    poste,
    grade,
    CustomLabelInput,
    showCustomLabelInput,
}: Props) => {
    const { setValue } = useFormContext();
    const dispatch = useAppDispatch();
    const {loading}  = useAppSelector(state => state.loading);
    const [animation,animate] = useState<boolean>(false);

    useEffect(() => {
        if(loading === false)
        {
            animate(true);
            setTimeout(() => {
                animate(false);
                showIntitulePanel(false);
            }, 2000);
        }
    }, [loading])
    
    return (
        <div className="z-40 w-full h-full fixed top-0 left-0 flex justify-center items-center bg-slate-700/80 ">
            <div className="w-2/6 bg-base-200 p-10 flex flex-col items-center gap-5 rounded-xl">
                {!CustomLabelInput ? (
                    <>
                        <p>
                            Voulez vous nommer utiliser le nom généré
                            automatiquement pour votre concours?
                        </p>
                        <p className="text-center font-bold">
                            Concours des {poste} de {direction}, {grade}
                        </p>
                        <div className="w-full flex justify-evenly">
                            <button
                                className="btn btn-outline btn-error w-28 hover:!text-white"
                                type="button"
                                disabled={loading === true}
                                onClick={() => {
                                    showIntitulePanel(false);
                                    showCustomLabelInput(false);
                                }}
                            >
                                Fermer
                            </button>
                            <button
                                className="btn btn-outline btn-success w-28 hover:!text-white"
                                type="submit"
                                onClick={() => {
                                    setValue(
                                        "intitulé",
                                        `Concours des ${poste} de ${direction}, ${grade}`,
                                    );
                                    dispatch(startLoading());
                                }}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : animation ? (
                                    <UilCheckCircle className="text-green-500" />
                                ) : (
                                    "Créer"
                                )}
                            </button>
                        </div>
                        <p>ou</p>
                        <button
                            className="btn font-bold btn-outline btn-neutral hover:btn-ghost"
                            type="button"
                            onClick={() => {
                                showCustomLabelInput(true);
                            }}
                        >
                            Choisir un intitulé personnalisé
                        </button>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold">
                            Choisissez un intitulé pour votre concours
                        </h1>
                        <Input
                            t_left_text="Intitulé du concours"
                            placeholder="Intitulé"
                            registerValue="intitulé"
                        />
                        <div className="w-full flex justify-evenly">
                            <button
                                className="btn btn-outline btn-error w-28 hover:!text-white"
                                type="button"
                                disabled={loading === true}
                                onClick={() => {
                                    showIntitulePanel(false);
                                    showCustomLabelInput(false);
                                }}
                            >
                                Fermer
                            </button>
                            <button
                                className="btn btn-outline btn-success w-28 hover:!text-white"
                                type="submit"
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : animation ? (
                                    <UilCheckCircle className="text-green-500" />
                                ) : (
                                    "Créer"
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default IntitulePanel;
