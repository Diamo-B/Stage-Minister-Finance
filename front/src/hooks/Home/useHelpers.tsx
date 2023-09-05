import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux";
import {
    startGenPageLoading,
    startLoading,
    stopGenPageLoading,
    stopLoading,
} from "../../Redux/loading";
import {
    hidePanel,
    setPanelData,
    showPanel,
} from "../../Redux/Concours/postuler";
import {
    addCandidatsToConcours,
    setConcours,
} from "../../Redux/Concours/concours";

const useHelpers = () => {
    const dispatch = useAppDispatch();
    const { connectedUser } = useAppSelector(state => state.genValues);
    const { concoursId } = useAppSelector(state => state.postuler);
    const navigate = useNavigate();

    const getConcours = () => {
        dispatch(startGenPageLoading());
        //explain: if the user is a visitor, we show all the concours.
        if (connectedUser !== null && connectedUser !== undefined) {
            fetch(
                `${import.meta.env.VITE_BackendBaseUrl}/concours/getAll/useful${connectedUser !== "visitor" ? "/withUserAssignments" : ""}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
                    },
                },
            )
                .then(async res => {
                    const response = await res.json();
                    dispatch(setConcours(response.concours));
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    dispatch(stopGenPageLoading());
                });
        }
    };

    const getConcoursResults = () => {};

    const showPanelOrRedirect = (id: string, title: string) => {
        if (connectedUser === "visitor") {
            //explain: redirect to login page while passing the current path as a state so that we can redirect the user back to the current path after login
            dispatch(setPanelData({ concoursId: id, concoursTitle: title }));
            navigate("/login", { state: { from: "/concours" } });
        } else {
            //explain: if the user is logged in, we show the confirmation panel
            if (connectedUser !== null && connectedUser !== undefined) {
                //explain: shows the confirmation panel
                dispatch(
                    setPanelData({
                        concoursId: id,
                        concoursTitle: title,
                    }),
                );
                dispatch(showPanel());
            }
        }
    };

    const postuler = () => {
        //explain: links the concours to the candidat
        dispatch(startLoading());
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/user/link/concours`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
            },
            body: JSON.stringify({
                concoursIds: [concoursId],
            }),
        })
            .then(async res => {
                let response = await res.json();
                const candidatId = response.id;
                dispatch(
                    addCandidatsToConcours({
                        concoursId: concoursId,
                        candidat: candidatId,
                    }),
                );
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                dispatch(stopLoading());
                dispatch(hidePanel());
            });
    };

    return { getConcours, postuler, showPanelOrRedirect, getConcoursResults };
};

export default useHelpers;
