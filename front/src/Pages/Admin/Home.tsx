import { useEffect } from "react";
import { useAppDispatch } from "../../Hooks/redux";
import { stopGenPageLoading } from "../../Redux/loading";

const Home = () => {
    const dispatch = useAppDispatch()
    useEffect(()=>{
        dispatch(stopGenPageLoading());
    },[])
    return (
        <div>
            <h1>Page d'accueil admin</h1>
        </div>
    );
};

export default Home;
