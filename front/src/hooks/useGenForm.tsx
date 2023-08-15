import {
    changeStep,
    changeStepStatus,
    resetSteps,
} from "../redux/RegisterationForm/formSteps";
import { startGenPageLoading, stopGenPageLoading } from "../redux/loading";
import { mailSent, setUser, setUserDetails } from "../redux/user";
import { useAppDispatch } from "./redux";

const useGenForm = () => {
    const dispatch = useAppDispatch();

    const regainStepState = async () => {
        dispatch(startGenPageLoading());
        const candidatId = await checkUserState();
        if (candidatId) {
            const step = localStorage.getItem("step");
            if (step) {
                const stepNumber = parseInt(step);
                //explain: The loop is to set the status of all the previous steps to "done"
                for (let i = 1; i < stepNumber; i++) {
                    dispatch(changeStepStatus({ order: i, status: "done" }));
                }
                dispatch(changeStep(stepNumber));
            }
        } else {
            dispatch(resetSteps());
        }
        dispatch(stopGenPageLoading());
    };

    const checkUserState = async () => {
        let id = null;
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const res = await fetch(
                    `${import.meta.env.VITE_BackendBaseUrl}/api/v1/verifyToken`,
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
                        }/api/v1/user/getone/candidat/` + candidatId,
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
