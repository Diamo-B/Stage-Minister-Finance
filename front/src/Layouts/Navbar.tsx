import {
    UilEllipsisH,
    UilBars,
    UilSignout,
    UilSetting,
    UilLink,
} from "@iconscout/react-unicons";
import { useNavigate } from "react-router-dom";
import ConfirmationPanel from "../Components/FormElements/confirmationPanel";
import { useAppDispatch, useAppSelector } from "../Hooks/redux";
import {
    hideConfirmationPanel,
    showConfirmationPanel,
} from "../Redux/confirmationPanel";
import { useEffect, useState } from "react";
import { setConnectedUser } from "../Redux/GeneralValues";
import { resetSteps } from "../Redux/RegisterationForm/formSteps";
import Menu from "./menu";
import { connectedUserSchema } from "../Redux/types/GeneralValuesTypes";
import { z } from "zod";

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { show, isConfirmed, functionParams } = useAppSelector(
        state => state.confirmationPanel,
    );
    const { connectedUser } = useAppSelector(state => state.genValues);
    
    
    useEffect(() => {
        if (isConfirmed && functionParams.logout) {
            /*
                ! Not reading this will absolutely lead you to bugs. They will be annoying to debug. Trust me, I've been there. :D

                * the ConfirmationPanel works in this way:
                * 1- you trigger the ConfirmationPanel by calling the showConfirmationPanel action which sets the show property to true, along with the text, itemIdentifier and functionParams properties
                ? the text is the text that will be displayed in the ConfirmationPanel
                ? if you are using the confirmationPanel to conduct an operation on a record, the itemIdentifier is anything that can serve as an identification of the record. it doesn't have anything to do with the logic, it's just a way to show to the user the record that he will be manipulating if he presses the confirmation button. (optional)
                ? the functionParams is an object that contains the parameters that will be passed to the function that will be executed if the user presses the confirmation button. (optional, you can execute a function with no params, in this case give it a value of null)

                * 2- the ConfirmationPanel component is rendered, it displays the text then gives a choice: confirm or cancel
                * 3- if the user presses the confirm button, the isConfirmed property is set to true, you can then use this isConfirmed state to trigger any sort of logic, the way we are doing in this useEffect.
                * 4- if the user presses the cancel button, the hideConfirmationPanel action is initiated which turns the isConfirmed property is set to false, then the show property is set to false, which hides the ConfirmationPanel component. (it serves as a component resetter)
                * 5- the ConfirmationPanel component is unmounted.
                
                !- Now for the confusing part: the ConfirmationPanel component is unmounted, but the isConfirmed property is still set to true, so if you don't reset it, the next time you call the showConfirmationPanel action, the ConfirmationPanel component will be rendered, but the isConfirmed property will be set to true, so the logic that you want to trigger when the user presses the confirm button will be triggered without the user pressing the confirm button.
                 
                => So whenever you execute the logic that is triggered using the confirmation button of the ConfirmationPanel, call the redux action 'hideConfirmationPanel' at then end. This will ensure that the isConfirmed property is reset to false whenever the ConfirmationPanel component is unmounted.
            */
            localStorage.removeItem("AccessToken");
            dispatch(setConnectedUser(null));
            dispatch(hideConfirmationPanel());
            dispatch(resetSteps());
            navigate("/login");
        }
    }, [isConfirmed]);

    const logout = () => {
        dispatch(
            showConfirmationPanel({
                text: "Voulez-vous vraiment vous déconnecter ?",
                itemIdentifier: null,
                functionParams: { logout: true },
            }),
        );
    };
    
    const [menu,showMenu] = useState(false);
    return (
        <>
            <nav className="navbar bg-base-200 border-b-2 border-neutral-content">
                <div className="navbar-start">
                <label className="btn btn-circle">
                    <input type="checkbox" className="hidden" 
                        onChange={()=>{
                            showMenu(!menu)
                        }}
                    />
                    <UilBars/>
                </label>
                </div>
                <div className="navbar-center relative">
                    <a className="btn btn-ghost normal-case text-xl">
                        Ministère de l'Économie et des Finances
                    </a>
                </div>
                <div className="navbar-end">
                    {connectedUser && (
                        <>
                            <p className="text-base text-base-100 mr-5 badge badge-lg badge-success flex gap-1">
                                <UilLink className="text-white" />
                                <span className="font-bold">
                                    {`${(connectedUser as z.infer<typeof connectedUserSchema>).email}`}
                                </span>
                            </p>
                        </>
                    )}
                    <div className="dropdown dropdown-end">
                        <label
                            tabIndex={0}
                            className="btn btn-ghost btn-circle"
                        >
                            <UilEllipsisH />
                        </label>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            <li>
                                <a>
                                    <UilSetting className="mr-2" />
                                    Settings
                                </a>
                            </li>
                            <li>
                                <button onClick={logout}>
                                    <UilSignout className="mr-2" />
                                    Déconnexion
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="relative w-full flex justify-center rounded-xl">
                {menu && <Menu menu={menu} showMenu={showMenu} userType={
                    connectedUser && (connectedUser as z.infer<typeof connectedUserSchema>).admin !== null ? 'admin' : 'candidat'
                }/>}
            </div>
            {show && <ConfirmationPanel customConfirmButton="Déconnexion" />}
        </>
    );
};

export default Navbar;
