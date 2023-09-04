import { useEffect, useState } from "react";
import LoginForm from "../Components/loginForm";
import useFormRegistry from "../Hooks/login/useFormRegistry";
import ForgetPassword from "./forgotPassword";
import AnimatedButton from "../Components/FormElements/animatedButton";
import { UilArrowLeft, UilArrowRight } from "@iconscout/react-unicons";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {

    const {checkToken} = useFormRegistry();
    const [forgotPassword, setForgotPassword] = useState<boolean>(false);
    const location = useLocation();
    useEffect(()=>{    
        checkToken();
    },[])

    const navigate = useNavigate();
    const sendToRegistrationPage = () => {
        const states = location.state;
        
        if(states)
            navigate('/register', {state: {...states} });
        else
            navigate('/register')
    }

    return (
        <>
            <div className="bg-base-200 flex flex-col justify-center items-center w-full flex-1 py-10">
                <div className="flex justify-center items-center gap-16">
                    <div className="text-center mb-auto w-2/4">
                        <div className="flex justify-center">
                            <img
                                className="lg:w-60 mb-5"
                                src="/testMEFNoBG.png"
                                alt="logo MEF"
                            />
                        </div>
                        <h1 className="2xl:text-3xl xl:text-xl font-bold text-center ">
                            Plateforme e-recrutement du Ministère de l'Économie
                            et des Finances
                        </h1>
                        <p className="py-6 font-base text-base text-left">
                            Cher(e) Candidat, Bienvenue sur l'espace de
                            recrutement de la MEF!! Cet espace vous offrira des
                            informations sur les nouvelles annonces et les
                            résultats des concours de recrutement au sein de ce
                            Ministère.
                        </p>
                        <p className="text-left">
                            Vous pouvez soit vous connecter si vous avez déjà un
                            compte, soit vous inscrire si vous n'en avez pas
                            encore.
                        </p>
                        <div className="flex flex-col justify-center items-center mt-6 space-x-4">
                            <AnimatedButton
                                customButtonClasses={[
                                    "!btn-wide",
                                    "btn-info",
                                    "border-2",
                                    "hover:btn-info",
                                    "text-neutral",
                                ]}
                                Icon={() => (
                                    <UilArrowRight className="mx-auto w-10 h-10 text-white " />
                                )}
                                text="S'inscrire"
                                onClickFct={() => sendToRegistrationPage()}
                            />

                            <AnimatedButton
                                customButtonClasses={[
                                    "!btn-wide",
                                    "btn-info",
                                    "border-2",
                                    "hover:btn-info",
                                    "text-neutral",
                                    "!ml-0",
                                ]}
                                Icon={() => (
                                    <UilArrowLeft className="mx-auto w-10 h-10 text-white " />
                                )}
                                text="Consulter les offres"
                                onClickFct={() => {
                                    navigate("/concours");
                                }}
                                ReverseAnimationDirection={true}
                            />
                        </div>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div className=" card-title mt-10 grid grid-cols-1 justify-items-center items-center">
                            <div className="w-full lg:text-base">
                                <h1 className="font-bold text-center">
                                    المملكة المغربية
                                </h1>
                                <h1 className="font-bold text-center">
                                    Royaume du maroc
                                </h1>
                            </div>

                            <img
                                className="2xl:w-32 lg:w-28 sm:w-20 "
                                src="/Coat_of_arms_of_Morocco.svg.png"
                                alt="Morocco Coat of arms"
                            />
                        </div>
                        <div className="card-body">
                            <LoginForm
                                forgotPassword={forgotPassword}
                                setForgotPassword={setForgotPassword}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {forgotPassword && (
                <ForgetPassword setForgotPassword={setForgotPassword} />
            )}
        </>
    );
};

export default Login;
