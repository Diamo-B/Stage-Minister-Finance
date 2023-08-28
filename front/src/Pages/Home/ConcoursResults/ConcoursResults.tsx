import ConcoursResultsTable from "./ConcoursResultsTable";

const ConcoursResults = () => {
    return (
        <div className="card rounded-box p-5 bg-base-100">
            <h1 className="font-bold text-lg bg-base-300 pl-5 py-1 rounded-full mb-2">
                Résultats des concours de recrutement
            </h1>
            <ConcoursResultsTable />
        </div>
    );
};

export default ConcoursResults;
