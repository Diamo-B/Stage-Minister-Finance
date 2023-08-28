import { UilCheck, UilFileDownload } from "@iconscout/react-unicons";
import AnimatedButton from "../../../Components/FormElements/animatedButton";
import { Link } from "react-router-dom";

const TestLatest = () => {
    return (
        <tr className="hover">
            <td className="text-left font-bold">
                Concours de recrutement des techniciens de 3ème grade
            </td>
            <td>
                <Link to="/assets/avis.pdf" download={true}>
                    <AnimatedButton
                        Icon={() => (
                            <UilFileDownload className="mx-auto w-7 h-7 text-white" />
                        )}
                        customButtonClasses={[
                            "!m-0",
                            "!w-24",
                            "btn-outline",
                            "border-slate-400",
                            "btn-sm",
                            "text-xs",
                            "font-medium",
                            "w-full",
                            "border-2",
                            "hover:!border-2",
                            "hover:border-slate-400",
                            "hover:bg-slate-400",
                        ]}
                        text="Télécharger"
                    />
                </Link>
            </td>
            <td>18-10-2023</td>
            <td>18-9-2023</td>
            <td>200</td>
            <td>Actif</td>
            <td className="">
                <AnimatedButton
                    Icon={() => (
                        <UilCheck className="mx-auto w-7 h-7 text-white" />
                    )}
                    customButtonClasses={[
                        "!m-0",
                        "!w-24",
                        "btn-outline",
                        "btn-success",
                        "btn-sm",
                        "text-xs",
                        "font-bold",
                        "w-full",
                        "border-2",
                        "hover:!border-2",
                    ]}
                    text="Postuler"
                />
            </td>
        </tr>
    );
}
 
export default TestLatest;