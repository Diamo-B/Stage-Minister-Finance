/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UilMinusCircle } from "@iconscout/react-unicons";
import {
    attachmentRecord,
    attachmentRecordValidation,
} from "../../../redux/RegisterationForm/types/lastStepTypes";
import {
    diplomeRecord,
    diplomeRecordValidation,
} from "../../../redux/RegisterationForm/types/diplomesTypes";
import ConfirmationPanel from "../confirmationPanel";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
    hideConfirmationPanel,
    showConfirmationPanel,
} from "../../../redux/confirmationPanel";

/* 
    !important: this component is used in step 4 and step 5 (View and delete added files)
*/

const Table = ({ deleteRecord, Records }: any) => {
    const dispatch = useAppDispatch();
    const { show, functionParams, isConfirmed } = useAppSelector(
        state => state.confirmationPanel,
    );
    const [isDiplome, setIsDiplome] = useState<boolean>(false);
    const [isAttachment, setIsAttachment] = useState<boolean>(false);

    useEffect(() => {
        if (!Records) return;
        setIsDiplome(diplomeRecordValidation.safeParse(Records).success);
        setIsAttachment(attachmentRecordValidation.safeParse(Records).success);
    }, [Records]);

    useEffect(() => {
        if (isConfirmed) {
            if (isDiplome) {
                deleteRecord(functionParams.id, functionParams.attachments);
            } else if (isAttachment) {
                deleteRecord(functionParams.id, functionParams.index);
            }
            dispatch(hideConfirmationPanel());
        }
    }, [isConfirmed]);

    if (isDiplome) {
        return (
            <div className="overflow-y-auto max-h-52">
                <table className="table relative text-center">
                    <thead className="sticky top-0 bg-base-200">
                        <tr>
                            <th className="text-left">Intitulé</th>
                            <th>Type</th>
                            <th>Filière</th>
                            <th>Spécialité</th>
                            <th>Établissement</th>
                            <th>Année d'obtention</th>
                            <th>Pays d'obtention</th>
                            <th>Supprimer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Records.length > 0 ? (
                            Records.map((Record: diplomeRecord) => (
                                <tr key={Record.id}>
                                    <th className="text-left">{Record.nom}</th>
                                    <td>{Record.type}</td>
                                    <td>{Record.filière}</td>
                                    <td>{Record.spécialité}</td>
                                    <td>{Record.université}</td>
                                    <td>{Record.annee}</td>
                                    <td>{Record.pays}</td>
                                    <td>
                                        <UilMinusCircle
                                            className="text-error mx-auto hover:cursor-pointer"
                                            onClick={() =>
                                                dispatch(
                                                    showConfirmationPanel({
                                                        text: "Voulez vous vraiment effacer le diplome?",
                                                        itemIdentifier:
                                                            Record.nom,
                                                        functionParams: {
                                                            id: Record.id,
                                                            attachments:
                                                                Record.attachments,
                                                        },
                                                    }),
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="text-center font-bold"
                                >
                                    Aucun diplôme n'a été ajouté
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {show && <ConfirmationPanel />}
            </div>
        );
    } else if (isAttachment) {
        return (
            <div className="overflow-y-auto max-h-52">
                <table className="table relative text-center border">
                    <thead className="sticky top-0 bg-base-200">
                        <tr>
                            <th>Nom de la pièce jointe</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Records.length > 0 ? (
                            Records.map(
                                (Record: attachmentRecord, index: number) => (
                                    <tr key={Record.id}>
                                        <th>
                                            {Record.path.split("/").slice(-1)}
                                        </th>
                                        <td>{Record.type}</td>
                                        <td>
                                            <div className="w-full flex items-center justify-center gap-5">
                                                <Link
                                                    to={`${
                                                        import.meta.env
                                                            .VITE_BackendBaseUrl
                                                    }${Record.path.replace(
                                                        "./public",
                                                        "",
                                                    )}`}
                                                    target="_blank"
                                                >
                                                    <button className="w-20 text-sm capitalize font-medium border-1 py-1 rounded-md text-primary hover:bg-primary hover:text-white">
                                                            afficher
                                                    </button>
                                                </Link>
                                                <button
                                                    className="w-20 text-sm capitalize font-medium border-1 py-1 rounded-md text-error hover:bg-error hover:text-white"
                                                    onClick={() =>
                                                        dispatch(
                                                            showConfirmationPanel(
                                                                {
                                                                    text: "Voulez vous vraiment effacer la piece jointe?",
                                                                    itemIdentifier:
                                                                        Record.path
                                                                            .split(
                                                                                "/",
                                                                            )
                                                                            .slice(
                                                                                -1,
                                                                            ),
                                                                    functionParams:
                                                                        {
                                                                            id: Record.id,
                                                                            index: index,
                                                                        },
                                                                },
                                                            ),
                                                        )
                                                    }
                                                >
                                                    supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ),
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="text-center font-bold"
                                >
                                    Aucune pièce jointe n'a été ajoutée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {show && <ConfirmationPanel />}
            </div>
        );
    }
};

export default Table;
