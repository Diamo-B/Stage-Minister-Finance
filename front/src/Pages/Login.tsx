import LoginForm from "../Components/loginForm";

const Login = () => {
    {
        /* responsive tailwind reference example ( only approx. ) */
    }
    {
        /* class xl: my laptop 1366*768 -> 55 inch huge screen*/
    }
    {
        /* class 2xl: 55 inch and higher */
    }
    return (
        <div className="bg-base-200 flex flex-col justify-center items-center w-full flex-1 py-10">
            <div className="flex justify-center items-center gap-16">
                <div className="text-center mb-auto w-2/4">
                    <div className="flex justify-center">
                        <img className="lg:w-60 mb-5" src="/public/testMEFNoBG.png" alt="logo MEF" />
                    </div>
                    <h1 className="2xl:text-3xl xl:text-xl font-bold text-center ">
                        Plateforme e-recrutement du Ministère de l'Économie et
                        des Finances
                    </h1>
                    <p className="py-6 font-base text-base text-left">
                        Cher(e) Candidat, Bienvenue sur l'espace de recrutement
                        de la MEF!! Cet espace vous offrira des informations sur
                        les nouvelles annonces et les résultats des concours de
                        recrutement au sein de ce Ministère.
                    </p>
                    <p className="text-left">
                        Vous pouvez soit vous connecter si vous avez déjà un
                        compte, soit vous inscrire si vous n'en avez pas encore.
                    </p>
                    <div className="flex justify-center mt-6 space-x-4">
                        <a
                            href="/register"
                            className="btn btn-circle btn-info btn-wide text-info-content"
                        >
                            S'inscrire
                        </a>
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
                            className="2xl:w-32 xl:w-20"
                            src="/public/Coat_of_arms_of_Morocco.svg.png"
                            alt="Morocco Coat of arms"
                        />
                    </div>
                    <div className="card-body">
                        <LoginForm/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
