import { Link } from "react-router-dom";
import AnimatedButton from "../Components/FormElements/animatedButton";
import { UilSignOutAlt } from "@iconscout/react-unicons";

const NeutralNavbar = () => {
    return (
        <div className="flex flex-col w-full">
            <div className="navbar bg-base-200 border-b-2 border-neutral-content">
                <div className="navbar-start">
                    <a className="btn btn-ghost normal-case text-xl">
                        Ministère de l'Économie et des Finances
                    </a>
                </div>
                <div className="navbar-end">
                    <div className="flex items-center gap-5">
                        <p className="font-bold ">Connecté en tant que visiteur</p>
                        <Link to={"/login"}>
                            <AnimatedButton
                                customButtonClasses={[
                                    "!btn-sm",
                                    '!m-0',
                                    "btn-info",
                                    "!border-2",
                                    "btn-outline",
                                    "!text-neutral",
                                    "border-neutral",
                                    "rounded-lg",
                                    "!hover:border-2",
                                    "hover:btn-info",
                                ]}
                                Icon={() => (
                                    <UilSignOutAlt className="mx-auto w-7 h-7 text-white " />
                                )}
                                text={"Se connecter"}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeutralNavbar;
