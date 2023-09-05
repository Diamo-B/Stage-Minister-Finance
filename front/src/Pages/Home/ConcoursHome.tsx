import LatestConcours from "../../Components/Concours/latestConcours/latestConcours";
import ConcoursResults from "../../Components/Concours/ConcoursResults/ConcoursResults";

const ConcoursHome = () => {
    return (
        <div className="w-full lg:px-10 2xl:px-28 py-5 flex-1 flex flex-col justify-center">
            <LatestConcours />
            <div className="divider"></div>
            <ConcoursResults />
        </div>  
    );
};

export default ConcoursHome;
