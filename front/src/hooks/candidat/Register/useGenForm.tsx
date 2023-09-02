import {
    changeStep,
    changeStepStatus,
    resetSteps,
} from "../../../Redux/RegisterationForm/formSteps";
import { startGenPageLoading, stopGenPageLoading } from "../../../Redux/loading";
import { mailSent, setUser, setUserDetails } from "../../../Redux/user";
import { useAppDispatch } from "../../redux";

const useGenForm = () => {
    const dispatch = useAppDispatch();

    const regainStepState = async () => {
        /* dispatch(startGenPageLoading());
        const candidatId = await checkUserState();
        if (candidatId) {
            const step = localStorage.getItem("step");
            if (step) {
                console.log("step: ", step);
                const stepNumber = parseInt(step);
                //explain: The loop is to set the status of all the previous steps to "done"
                for (let i = 1; i < stepNumber; i++) {
                    dispatch(changeStepStatus({ order: i, status: "done" }));
                }
                dispatch(changeStep(stepNumber));
            }
        } else {
            dispatch(resetSteps());
            localStorage.removeItem("RegistrationToken");
            localStorage.removeItem("step");
        }
        dispatch(stopGenPageLoading()); */
    };

    const checkUserState = async () => {
        let id = null;
        try {
            const token = localStorage.getItem("RegistrationToken");
            if (token) {
                const res = await fetch(
                    `${import.meta.env.VITE_BackendBaseUrl}/accounts/verifyToken`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const { candidatId } = await res.json();
                id = candidatId;

                if (candidatId !== null && candidatId !== undefined) {
                    const userRes = await fetch(
                        `${
                            import.meta.env.VITE_BackendBaseUrl
                        }/user/getone/candidat/` + candidatId,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        },
                    );

                    const response = await userRes.json();
                    if (response.status !== 500 && !response.error) {
                        dispatch(setUser(response.user));
                        dispatch(mailSent());
                        dispatch(
                            setUserDetails({
                                adresse: response.adresse,
                                ville: response.ville,
                                zip: response.codePostal,
                            }),
                        );
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
        return id;
    };

    return { regainStepState };
};

export default useGenForm;
