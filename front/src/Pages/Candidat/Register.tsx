import { useEffect } from "react";
import GenForm from "../../Components/Candidat/Registration/genForm";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../Hooks/redux";
import useGenForm from "../../Hooks/candidat/Register/useGenForm";

const Register = () => {
    const location = useLocation();
    const { connectedUser } = useAppSelector(state => state.genValues);
    const { regainStepState } = useGenForm();	
    
    useEffect(() => {
        regainStepState()
    }, [location, connectedUser, localStorage.getItem("AccessToken")]);

    return (
        <div className="w-full flex-1 flex justify-center items-center py-10">
            <GenForm />
        </div>
    );
};

export default Register;
