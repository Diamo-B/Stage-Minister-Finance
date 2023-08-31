import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../Hooks/redux";
import { setUserType } from "../../../Redux/GeneralValues";

type Props = {
    userTypes: string[];
};

const WithAuthCheck = ({ userTypes }: Props) => {
    const navigate = useNavigate();
    const location = useLocation(); //? used only with the purpose of being inside the deps of the useEffect to force a re-render whenever the location changes
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log('WithAuthCheck');
        
        const token = localStorage.getItem("AccessToken");

        if (token) {
            fetch(
                `${import.meta.env.VITE_BackendBaseUrl}/accounts/verifyToken`,
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

                    const userTypesResponse = userTypes.filter(
                        userType =>
                            response.user[userType] !== null &&
                            response.user[userType] !== undefined,
                    );

                    if (userTypesResponse.length === 0) {
                        navigate("/login");
                    } else {
                        dispatch(setUserType(userTypesResponse[0]));
                    }
                })
                .catch(async err => {
                    console.error(err);
                });
        } else {
            if (userTypes.includes("visitor")) {
                dispatch(setUserType("visitor"));
            } else {
                navigate("/login");
            }
        }
    }, [location]);

    return <Outlet />;
};

export default WithAuthCheck;
