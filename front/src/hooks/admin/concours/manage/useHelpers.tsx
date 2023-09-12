import { deleteConcoursFromFiltered, setConcours, setFilteredConcours } from "../../../../Redux/Admin/concours/manage";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { hideConfirmationPanel} from "../../../../Redux/confirmationPanel";
import { deleteConcours } from "../../../../Redux/Admin/concours/manage";
import { activateAlert } from "../../../../Redux/alerts";

const useHelpers = () => {
    const dispatch = useAppDispatch();
  const getConcours = async() => {
    fetch(`${import.meta.env.VITE_BackendBaseUrl}/concours/getAll`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(async (res)=>{
        const response = await res.json();
        dispatch(setConcours(response.concours));
        dispatch(setFilteredConcours(response.concours));
    }).catch((err)=>{
        console.error(err);
    })
  }

  const {functionParams} = useAppSelector(state=>state.confirmationPanel)


  const removeConcours = async() => {
    fetch(`${import.meta.env.VITE_BackendBaseUrl}/concours/delete/${functionParams.id}`,{
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('AccessToken')}`
        }
    }).then(async (res)=>{
        const response = await res.json();
        if(response)
        {
            //explain: remove the concours from the redux store
            dispatch(deleteConcours(functionParams.id))
            dispatch(deleteConcoursFromFiltered(functionParams.id))
            dispatch(hideConfirmationPanel())
            dispatch(activateAlert({
                message: 'Concours supprimé avec succès',
                level: 'alert-success'
            }))
        }
    }).catch(err=>{
        console.error(err);
        dispatch(hideConfirmationPanel())
        dispatch(activateAlert({
            message: 'Une erreur est survenue lors de la suppression du concours',
            level: 'alert-error'
        }))
    })
  }

  return {getConcours,removeConcours}
}

export default useHelpers