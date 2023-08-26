import { Outlet, Link } from "react-router-dom";

const NeutralNavbar = () => {
    return (
        <>
            <div className="navbar bg-base-200 border-b-2 border-neutral-content">
                <div className="navbar-start">
                    <a className="btn btn-ghost normal-case text-xl">
                        Ministère de l'Économie et des Finances
                    </a>
                </div>
                <div className="navbar-end">
                    <div className="flex items-center">
                        <Link to={'/register'}><button className="btn">s'inscrire</button></Link>
                        <Link to={'/login'}><button className="btn">se connecter</button></Link>
                    </div>
                </div>
            </div>
            <div className="w-full py-10 flex flex-col justify-center items-center">
                <Outlet />
            </div>
        </>
    );
};

export default NeutralNavbar;
