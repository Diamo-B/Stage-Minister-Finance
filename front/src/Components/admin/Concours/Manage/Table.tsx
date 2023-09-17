import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../Hooks/redux";
import { showConfirmationPanel } from "../../../../Redux/confirmationPanel";
import ConfirmationPanel from "../../../FormElements/confirmationPanel";
import useHelpers from "../../../../Hooks/admin/concours/manage/useHelpers";
import Toast from "../../../toast";
import { setInfo } from "../../../../Redux/Admin/concours/manage";
import { useNavigate } from "react-router-dom";

const Table = () => {
    const {filteredConcours} = useAppSelector(state=>state.concoursManagement)
    const {show, isConfirmed} = useAppSelector(state=>state.confirmationPanel)
    const { alert } = useAppSelector(state => state.alert);
    const dispatch = useAppDispatch();
    
    const removeConcours = (id:string, title: string) => {
        if(!show){
            dispatch(showConfirmationPanel({
                text: 'Voulez-vous vraiment supprimer ce concours ?',
                itemIdentifier: title,
                functionParams: {id}
            }))
        }
    }

    const {removeConcours:removeConcoursOp} = useHelpers();
    useEffect(()=>{
        if(isConfirmed){
            //explain: calling the deletion API
            removeConcoursOp()
        }
    },[isConfirmed])

    const navigate = useNavigate();
    
    return (
        <div className="overflow-y-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                className="checkbox checkbox-xs checkbox-success"
                            />
                        </th>
                        <th>Label</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredConcours && filteredConcours.length > 0 ?
                        filteredConcours.map((c)=>(
                            <tr className="hover" key={c.id}>
                                <th>
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-xs checkbox-success"
                                    />
                                </th>
                                <td>
                                    {c.label}
                                </td>
                                <td className="text-center">
                                    <div className={`badge badge-outline w-20 ${c.status === 'enabled'?'badge-success':'badge-error'}`}>
                                        {c.status === 'enabled'?'Actif':'Clôturé'}
                                    </div>
                                </td>
                                <td >
                                    <div className="flex justify-center gap-2 items-center">
                                        <button className="btn w-24 btn-xs btn-outline btn-success disabled:btn-disabled hover:!text-white"
                                            onClick={()=>{
                                                navigate(`/admin/concours/categorize`, {state: {concoursId: c.id}})
                                            }}
                                            disabled={c.candidats.length === 0 || c.status in ['disabled','ended']}
                                        >Catégoriser</button>
                                        <button className="btn w-24 btn-xs btn-outline btn-info hover:!text-white"
                                            onClick={()=>{
                                                dispatch(setInfo(c))
                                                    }}
                                        >Info</button>
                                        <button className="btn w-24 btn-xs btn-outline btn-warning hover:!text-white"
                                            onClick={()=>{
                                                navigate(`/admin/concours/create`, {state: {isModify: c}})
                                            }}
                                        >
                                            Modifier
                                        </button>
                                        <button className="btn w-24 btn-xs btn-outline btn-error hover:!text-white"
                                            onClick={()=>{
                                                removeConcours(c.id, c.label)
                                            }}
                                        >Supprimer</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        :
                        <tr>
                            <td colSpan={4} className="text-center font-bold text-base">
                                Aucun concours n'a été trouvé
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            {
                show && <ConfirmationPanel />
            }
            {
                alert.status &&
                <Toast />
            }
        </div>
    );
};

export default Table;
