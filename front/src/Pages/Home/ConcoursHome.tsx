import LatestConcours from "../../Components/Concours/latestConcours/latestConcours";
import ConcoursResults from "../../Components/Concours/ConcoursResults/ConcoursResults";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../Hooks/redux";
import { connectedUserSchema } from "../../Redux/types/GeneralValuesTypes";
import { z } from "zod";
import useHelpers from "../../Hooks/Home/useHelpers";

const ConcoursHome = () => {

    const [listOnly, showListOnly] = useState<boolean|null>(null);
    const [resultsOnly, showResultsOnly] = useState<boolean|null>(null);
    const location = useLocation();
    const {connectedUser} = useAppSelector(state => state.genValues);
    const { getConcours, getConcoursResults } = useHelpers()
   
    useEffect(() => {
        if((connectedUser as z.infer<typeof connectedUserSchema>)?.candidat?.id || connectedUser === 'visitor')
            getConcours();
            getConcoursResults();
    }, [connectedUser]);

    useEffect(()=>{
        
            if(location.state?.listOnly === true)
            {
                showListOnly(true);
                showResultsOnly(false);
            }
            else if(location.state?.resultsOnly === true)
            {
                showListOnly(false);
                showResultsOnly(true);
            }
        
    },[location])

    return (
        <div className="w-full lg:px-10 2xl:px-28 py-5 flex-1 flex flex-col justify-center">
            {
                listOnly === null && resultsOnly === null ? 
                    <>
                        <LatestConcours />
                        <div className="divider"></div>
                        <ConcoursResults />        
                    </>
                :
                null
            }
            {
                listOnly === true && resultsOnly === false &&
                    <LatestConcours />
            }
            {
                listOnly === false && resultsOnly === true &&
                    <ConcoursResults /> 
            }
        </div>  
    );
};

export default ConcoursHome;
