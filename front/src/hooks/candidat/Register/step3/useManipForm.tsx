import { z } from "zod";
import { IDetailsForm } from "../../../../utils/interfaces/RegistrationForm/IDetailsForm";
import { useAppSelector, useAppDispatch } from "../../../redux";
import { setUserDetails } from "../../../../redux/user";
import {
    changeStepStatus,
    incrementStep,
} from "../../../../redux/RegisterationForm/formSteps";

const useManipForm = () => {
    const dispatch = useAppDispatch();
    const { current } = useAppSelector(state => state.formSteps);

    const schema = z.object({
        adresse1: z.string().nonempty(),
        adresse2: z.string().nullish(),
        region: z.string().nonempty().or(z.number()),
        ville: z.string().nonempty(),
        zip: z.number().int().positive().gt(10000).lte(99999),
    });

    const saveUserDetails = (data: IDetailsForm) => {
        fetch(
            `${
                import.meta.env.VITE_BackendBaseUrl
            }/user/update/candidat`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    adresse: data.adresse1 + ", " + data.adresse2,
                    ville: data.ville,
                    zip: data.zip,
                }),
            },
        )
            .then(async res => {
                if (res.ok) {
                    const user = await res.json();
                    //explain: modify user in redux
                    dispatch(
                        setUserDetails({
                            adresse: user.adresse,
                            ville: {
                                id: data.ville,
                                nom: user.ville.nom,
                            },
                            zip: user.zip,
                        }),
                    );
                    //explain: modify the status of the form step
                    dispatch(
                        changeStepStatus({
                            order: current,
                            status: "done",
                        }),
                    );
                    //explain: go to next step
                    dispatch(incrementStep());
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    return { schema, saveUserDetails };
};

export default useManipForm;
