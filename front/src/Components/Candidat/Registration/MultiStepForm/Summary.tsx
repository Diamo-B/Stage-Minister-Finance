import { UilCheckCircle } from "@iconscout/react-unicons";
import { useEffect, useState } from "react";
const Summary = () => {
    const [countdownValue, setCountdownValue] = useState<number>(3);
    useEffect(()=>{
        if (countdownValue!==0) {
            setTimeout(() => {
                setCountdownValue(countdownValue-1);
            }, 1000);
        }
        if (countdownValue===0) {
            console.log('redirect');
        }
    },[countdownValue])
    return (
        <div className="flex flex-col justify-center items-center mb-5">
            <div className="flex justify-center items-center gap-6 rounded-xl bg-white p-10 mb-10">
                <UilCheckCircle className="w-24 h-24 text-emerald-400" />
                <div>
                    <p className="font-bold text-2xl">Félicitations !</p>
                    <p className="text-base">
                        Vous êtes enfin inscrit dans notre e-plateforme de
                        recrutement.
                    </p>
                    <p className="text-base">
                        On vous souhaite bon courage dans vos prochains
                        concours.
                    </p>
                </div>
            </div>
            <p className="font-bold text-lg">
                Vous serez redirigé vers votre tableau de bord dans
            </p>
            <div
                className={`flex flex-col items-center p-2 bg-base-100 rounded-box text-base-content my-5 ${
                    countdownValue === 0 ? "bg-success text-base-100" : ""
                }`}
            >
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": countdownValue }}></span>
                </span>
                sec
            </div>
            <p className="font-bold text-lg">
                Si vous n'êtes pas redirigé automatiquement après 3 secondes,
                cliquez ici
            </p>
        </div>
    );
};

export default Summary;
