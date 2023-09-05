import { UilCheck } from "@iconscout/react-unicons";
import AnimatedButton from "../../FormElements/animatedButton";
import { useAppDispatch, useAppSelector } from "../../../Hooks/redux";
import { hideAlreadyAppliedPanel, hidePanel, resetPanelData } from "../../../Redux/Concours/postuler";
import useHelpers from "../../../Hooks/Home/useHelpers";

const PostulerPanel = () => {
    const dispatch = useAppDispatch();
    const { show, showAlreadyApplied, concoursTitle } = useAppSelector(state => state.postuler);
    const {loading } = useAppSelector(state => state.loading);
    const { postuler } = useHelpers();

    return (
        <div className="fixed top-0 left-0 h-screen w-full z-50 flex justify-center items-center bg-slate-700/40">
                    <div className="2xl:w-1/3 lg:w-2/4 bg-white rounded-lg text-center py-7 px-20 flex flex-col gap-5">
                        {
                            show === true ?
                            <>
                                <p className="text-lg">
                                    Voulez-vous vraiment postuler à ce concours ?
                                </p>
                                <h1 className="font-bold text-lg">{concoursTitle}</h1>
                                <div className="w-full flex justify-evenly items-center">
                                    <button className="btn btn-outline btn-error w-28 hover:!text-white"
                                        onClick={()=>{
                                            dispatch(resetPanelData())
                                            dispatch(hidePanel())
                                        }}
                                    >
                                        Annuler
                                    </button>
                                    <button className="btn btn-outline btn-success w-28 hover:!text-white"
                                        onClick={postuler}
                                    >
                                        {
                                            loading ? 
                                            <span className="loading loading-spinner loading-md"></span>
                                            :
                                            'Confirmer'
                                        }
                                    </button>
                                </div>
                            </>
                        :
                            showAlreadyApplied === true ?
                            <>
                                <p className="text-lg">
                                    Vous avez deja postuler au concours
                                </p>
                                <h1 className="font-bold text-lg">{concoursTitle}</h1>
                                <div className="w-full flex justify-center">
                                    <AnimatedButton
                                        text="Compris"
                                        Icon={() => <UilCheck className="mx-auto w-7 h-7 text-white" />}
                                        customButtonClasses={[
                                            "!m-0",
                                            "!w-32",
                                            "btn-md",
                                            "btn-outline",
                                            "btn-success",
                                            "text-sm",
                                            "font-bold",
                                            "border-2",
                                            "hover:!border-2",
                                        ]}
                                        onClickFct={()=>{
                                            dispatch(resetPanelData())
                                            dispatch(hideAlreadyAppliedPanel())
                                        }}
                                    />
                                </div>
                            </>
                            :
                            ''
                        }
                    </div>
                </div>
    );
}

export default PostulerPanel;