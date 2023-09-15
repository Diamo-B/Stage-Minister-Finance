import { UilExclamationOctagon } from "@iconscout/react-unicons";
import {
    hideConfirmationPanel,
    setIsConfirmed,
} from "../../Redux/confirmationPanel";
import { useAppDispatch, useAppSelector } from "../../Hooks/redux";

type Props = {
    customConfirmButton?: string;
}

const ConfirmationPanel = ({ customConfirmButton }: Props) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.loading);
    const { text, itemIdentifier } = useAppSelector(
        state => state.confirmationPanel,
    );

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-slate-700/50 inset-0">
            <div className="card w-6/12 bg-base-300 ">
                <div className="card-body items-center text-center !gap-5">
                    <h2 className="card-title">
                        <UilExclamationOctagon className="text-error w-12 h-12" />
                    </h2>
                    <p className="font-bold text-base-content">{text}</p>
                    {itemIdentifier && (
                        <p className="font-bold text-base-content">
                            {itemIdentifier}
                        </p>
                    )}
                    <div className="card-actions justify-end">
                        <button
                            className={`capitalize border-1 w-28 py-1 rounded-md font-medium btn-outline btn-error ${
                                loading ? "hover:!bg-transparent" : ""
                            } group`}
                            onClick={() => {
                                dispatch(setIsConfirmed());
                            }}
                        >
                            <span className="text-base-content group-hover:!text-white">
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm text-error"></span>
                                ) : (
                                    customConfirmButton? customConfirmButton : "Supprimer"
                                )}
                            </span>
                        </button>
                        <button
                            className="capitalize border-1 w-28 py-1 rounded-md font-medium btn-outline btn-neutral"
                            onClick={() => {
                                dispatch(hideConfirmationPanel());
                            }}
                        >
                            annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPanel;
