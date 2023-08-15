import {
    removeDiplome,
    setDiplomes,
} from "../../redux/RegisterationForm/diplomes";
import { decrementHint, setHint } from "../../redux/RegisterationForm/formTabs";
import { startLoading, stopLoading } from "../../redux/loading";
import { useAppDispatch } from "../redux";

const useHelpers = () => {
    const dispatch = useAppDispatch();

    const getCandidatDiplomas = (token: string) => {
        fetch(
            `${
                import.meta.env.VITE_BackendBaseUrl
            }/api/v1/diplome/getAll/byCandidat`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        )
            .then(async res => {
                const response = await res.json();
                const dips = [];
                for (const dip of response) {
                    dips.push({
                        id: dip.id,
                        nom: dip.label,
                        type: dip.type.nom,
                        spécialité: dip.speciality.nom,
                        filière: dip.affiliation.Filiere,
                        université: dip.ecole.nom,
                        pays: dip.paysObtention.nom,
                        annee: parseInt(dip.anneeObtention),
                        attachments: dip.attachments,
                    });
                }
                dispatch(setHint(dips.length));
                dispatch(setDiplomes(dips));
            })
            .catch(err => {
                console.error(err);
            });
    };

    //explain: this deletes a diploma from the database
    const deleteDiplome = (
        diplomeId: string,
        attachments: { path: string }[],
    ) => {
        dispatch(startLoading());
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/api/v1/diplome/delete`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                diplomeId,
                attachments,
            }),
        })
            .then(async res => {
                const response = await res.json();
                if (response.id === diplomeId) {
                    dispatch(removeDiplome(diplomeId));
                    dispatch(decrementHint());
                }
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => dispatch(stopLoading()));
    };

    return { getCandidatDiplomas, deleteDiplome };
};

export default useHelpers;
