// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UilEllipsisH, UilBars } from "@iconscout/react-unicons";

const Navbar = () => {
    return (
        <div className="navbar bg-base-200 border-b-2 border-neutral-content">
            <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                    <UilBars />
                </button>
            </div>
            <div className="flex-1 items-center">
                <a className="btn btn-ghost normal-case text-xl">
                    Ministère de l'Économie et des Finances
                </a>
            </div>
            <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                    <UilEllipsisH />
                </button>
            </div>
        </div>
    );
};

export default Navbar;
