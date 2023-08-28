import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../Hooks/redux";
import { setUserType } from "../../../Redux/GeneralValues";

type Props = {
    userTypes: string[];
}

const RouteOutlet = ({userTypes}:Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        
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
                    console.log(response);
                    
                    const userTypesResponse = userTypes.filter(
                        userType => response.user[userType] !== null && response.user[userType] !== undefined,
                    );
                    
                    if (userTypesResponse.length === 0) {
                        navigate("/login");
                    } else {
                        console.log(userTypesResponse[0]);
                        
                        dispatch(setUserType(userTypesResponse[0]));
                    }
                })
                .catch(async err => {
                    console.error(err);
                });
        }
        else
        {
            if (userTypes.includes("visitor")) {
                dispatch(setUserType("visitor"));
            } else {
                navigate("/login");
            }
        }
        
    }, []);

    return (
        <Outlet />
    );
};

export default RouteOutlet;
