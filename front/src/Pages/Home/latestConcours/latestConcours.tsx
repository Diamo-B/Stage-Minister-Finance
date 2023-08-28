import LatestConcoursTable from "./latestConcoursTable";

const LatestConcours = () => {
    return (
        <div className="card rounded-box p-5 bg-base-100">
            <h1 className="font-bold text-lg bg-base-300 pl-5 py-1 rounded-full mb-2">
                Dernières annonces de recrutement
            </h1>
            <LatestConcoursTable />
        </div>
    );
};

export default LatestConcours;
