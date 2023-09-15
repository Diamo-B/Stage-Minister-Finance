import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

type Props = {
    menu: boolean;
    showMenu: Dispatch<SetStateAction<boolean>>;
    userType: "candidat" | "admin";
};

const Menu = ({ userType, menu, showMenu }: Props) => {
    const menuRef = useRef<HTMLUListElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                showMenu(false);
            }
        };

        if (menu) {
            // Attach the click event listener when the menu is open
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            // Remove the event listener when the menu is closed
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menu, showMenu]);
    return (
        <ul
            className="absolute shadow-2xl menu menu-horizontal bg-base-100 z-30 top-2 border-2 border-neutral-content rounded-2xl"
            ref={menuRef}
        >
            {
                userType === "admin" && (
                <>
                    <li>
                        <p className="flex justify-center font-bold hover:bg-base-100 pointer-events-none">
                            Concours
                        </p>
                        <ul>
                            <li
                                onClick={() => {
                                    showMenu(false);
                                }}
                            >
                                <Link to={"/admin/concours"}>
                                    Manipulation des concours
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p className="flex justify-center font-bold hover:bg-base-100 pointer-events-none">
                            Utilisateurs
                        </p>
                        <ul>
                            <li
                                onClick={() => {
                                    showMenu(false);
                                }}
                            >
                                <a>gestion des utilisateurs</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <p className="flex justify-center font-bold hover:bg-base-100 pointer-events-none">
                            Stats
                        </p>
                        <ul>
                            <li
                                onClick={() => {
                                    showMenu(false);
                                }}
                            >
                                <a>Consultation des statistiques</a>
                            </li>
                        </ul>
                    </li>
                </>
            )}

            {
                userType === "candidat" && (
                <>
                    <div className="w-full text-lg">
                        <p className="flex justify-center font-bold hover:bg-base-100 pointer-events-none">
                            Gestionnaire de Concours
                        </p>
                    </div>
                    <div className="grid grid-cols-3 place-items-center mx-auto">
                        <ul className="menu menu-horizontal">
                            <li
                                onClick={() => {
                                    showMenu(false);
                                }}
                            >
                                <Link to={"/concours"} state={{listOnly: true}}>
                                    Consulter la liste des concours
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-horizontal">
                            <li
                                onClick={() => {
                                    showMenu(false);
                                }}
                            >
                                <Link to={"/concours"} state={{resultsOnly: true}}>
                                    Consulter les résultats
                                </Link>
                            </li>
                        </ul>
                        <ul className="menu menu-horizontal">
                            <li
                                onClick={() => {
                                    showMenu(false);
                                }}
                            >
                                <a>Consultation l'historique des postulations</a>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </ul>
    );
};

export default Menu;
