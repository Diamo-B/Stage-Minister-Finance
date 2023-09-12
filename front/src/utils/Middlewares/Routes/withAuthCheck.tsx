import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../Hooks/redux";
import { setConnectedUser } from "../../../Redux/GeneralValues";
import { startGenPageLoading, stopGenPageLoading } from "../../../Redux/loading";

type Props = {
    userTypes: string[];
};

const WithAuthCheck = ({ userTypes }: Props) => {
    const navigate = useNavigate();
    const location = useLocation(); //? used only with the purpose of being inside the deps of the useEffect to force a re-render whenever the location changes
    const dispatch = useAppDispatch();
    useEffect(()=>{
        dispatch(startGenPageLoading()); 
    },[])
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
                    dispatch(setConnectedUser(response.user))
                    const userTypesResponse = userTypes.filter(
                        userType =>
                            response.user[userType] !== null &&
                            response.user[userType] !== undefined,
                    );
                    if (userTypesResponse.length === 0) {
                        navigate("/login");
                    } else {                        
                        if(userTypesResponse.includes('candidat'))
                        {
                            if(response.user.candidat.status === 'Verified' && !location.state?.continueRegistration){
                                navigate('/register',{state:{continueRegistration:true, from:location.pathname}});
                            }
                        }
                    }
                })
                .catch(async err => {
                    console.error(err);
                    navigate("/login");
                });
        } else {
            if (userTypes.includes("visitor")) {
                dispatch(setConnectedUser("visitor"));
            } else {
                navigate("/login");
            }
        }
        dispatch(stopGenPageLoading())
    }, [location]);

    return <Outlet />;
};

export default WithAuthCheck;