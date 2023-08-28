import { UilFileDownload } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import AnimatedButton from "../../../Components/FormElements/animatedButton";

const TestResult = () => {
    return (
        <tr className="hover">
            <td className="text-left font-bold min-w-max">
                Concours de recrutement des techniciens de 3ème grade
            </td>
            <td>18-10-2023</td>
            <td>233</td>
            <td>
                <Link to="/assets/avis.pdf" download={true}>
                    <AnimatedButton
                        Icon={() => (
                            <UilFileDownload className="mx-auto w-7 h-7 text-slate-400" />
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
            <td>-------</td>
            <td>-------</td>
            <td>
                <Link to="/assets/avis.pdf" download={true}>
                    <AnimatedButton
                        Icon={() => (
                            <UilFileDownload className="mx-auto w-7 h-7 text-slate-400" />
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
        </tr>
    );
}
 
export default TestResult;