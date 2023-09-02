import {
    changeStep,
    changeStepStatus,
    resetSteps,
} from "../../../Redux/RegisterationForm/formSteps";
import {
    startGenPageLoading,
    stopGenPageLoading,
} from "../../../Redux/loading";
import { useAppDispatch, useAppSelector } from "../../redux";
import { setConnectedUser } from "../../../Redux/GeneralValues";

const useGenForm = () => {
    const dispatch = useAppDispatch();
    const { connectedUser } = useAppSelector(state => state.genValues);
    
    const regainStepState = async () => {
        dispatch(startGenPageLoading());
        const accessToken = localStorage.getItem("AccessToken");
        if (accessToken) {
            //explain: if the user is connected and flagged as someone who didn't finish his registration (verified but not fully registred), we create and assign to it a registration token and a step counter to redirect him to the right step.

            if (typeof connectedUser === "object") {
                fetch(
                    `${
                        import.meta.env.VITE_BackendBaseUrl
                    }/accounts/continueRegistration`,
                    {
                        method: "get",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    },
                )
                    .then(async res => {
                        const response = await res.json();

                        if (response.token) {
                            localStorage.setItem(
                                "RegistrationToken",
                                response.token,
                            );
                        }
                        if (response.step) {
                            //explain: setting the step number in the localStorage

                            localStorage.setItem("step", response.step);
                            //explain: setting the step number in the redux store
                            const stepNumber = parseInt(response.step);
                            //explain: The loop is to set the status of all the previous steps to "done"
                            for (let i = 1; i < stepNumber; i++) {
                                dispatch(
                                    changeStepStatus({
                                        order: i,
                                        status: "done",
                                    }),
                                );
                            }
                            dispatch(changeStep(stepNumber));
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        } else {
            if (connectedUser === "visitor") {
                //explain: if the user is not logged in, we check whether he have a registration token (means that he started the registration process before) and if so, we verify his registration, !! we sign him in !! then set the connectedUser in the redux store
                const regToken = localStorage.getItem("RegistrationToken");
                if (regToken !== undefined && regToken !== null) {
                    fetch(
                        `${
                            import.meta.env.VITE_BackendBaseUrl
                        }/accounts/visitors/verifyPastRegistration`,
                        {
                            method: "get",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${regToken}`,
                            },
                        },
                    )
                        .then(async res => {
                            const response = await res.json();
                            if (res.ok) {
                                if (
                                    response.user.candidat.status === "Verified"
                                ) {
                                    dispatch(setConnectedUser(response.user));
                                    if (response.token) {
                                        localStorage.setItem(
                                            "AccessToken",
                                            response.token,
                                        );
                                    }
                                }
                            } else {
                                if (response.status === 403) {
                                    localStorage.removeItem(
                                        "RegistrationToken",
                                    );
                                    localStorage.removeItem("step");
                                    dispatch(resetSteps());
                                }
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        });
                } else {
                    localStorage.removeItem("step");
                    dispatch(resetSteps());
                }
            }
        }
        dispatch(stopGenPageLoading());
    };

    return { regainStepState };
};

export default useGenForm;
