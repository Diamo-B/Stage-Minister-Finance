import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

type Props = {
    userType: string;
}

const RouteOutlet = ({userType}:Props) => {
    const navigate = useNavigate();

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
                    if (!response.user[userType]?.id) {
                        navigate("/login");
                    }
                })
                .catch(async err => {
                    console.error(err);
                });
        }
        else
        {
            navigate("/login");
        }
    }, []);

    return (
        <>
            <Outlet />
        </>
    );
};

export default RouteOutlet;
