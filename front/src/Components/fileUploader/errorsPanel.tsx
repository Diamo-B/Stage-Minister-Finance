import { UilExclamationOctagon } from "@iconscout/react-unicons";
import { errorsField } from "../../Utils/interfaces/IFileUpload";
import { useFormContext } from "react-hook-form";

type Props = {
    errors: errorsField;
    humanFileSize: (size: number, si: boolean) => string;
    setErrors: (errors: errorsField | null) => void;
    reg: string;
};

const ErrorsPanel = ({ errors, humanFileSize, setErrors, reg }: Props) => {
    const { clearErrors } = useFormContext();

    return (
        <div className="w-full flex flex-col max-h-52 rounded-xl bg-base-100 p-5 overflow-y-auto text-center">
            <div className="flex-grow w-full flex flex-col justify-center items-center gap-5">
                <h1>
                    <UilExclamationOctagon className="text-error w-10 h-10" />
                </h1>
                {errors.requiredError === true ? (
                    <h1>Vous devez sélectionner au moins un fichier !! </h1>
                ) : (
                    <div>
                        {errors.numberError === true ? (
                            <h1>
                                Vous pouvez sélectionner un maximum de 2
                                fichiers !!
                            </h1>
                        ) : (
                            (errors.sizeErrors.length > 0 ||
                                errors.typeErrors.length > 0) && (
                                <>
                                    <h1>
                                        Les fichiers suivants seront exclus de
                                        la liste des fichiers sélectionnés:{" "}
                                    </h1>
                                    {errors.sizeErrors.length > 0 && (
                                        <ul className="list-disc">
                                            {errors.sizeErrors.map(
                                                (err, index) => (
                                                    <li key={index}>
                                                        {err.file} | Taille:
                                                        {humanFileSize(
                                                            err.size,
                                                            true,
                                                        )}{" "}
                                                        &gt; 4MB
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                    {errors.typeErrors.length > 0 && (
                                        <ul className="list-disc list-inside">
                                            {errors.typeErrors.map(
                                                (err, index) => (
                                                    <li key={index}>
                                                        {err.file} est un
                                                        fichier de type:{" "}
                                                        {err.type}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                </>
                            )
                        )}
                    </div>
                )}
                <button
                    className="PrevXnext !bg-base-200 hover:!bg-error hover:text-white"
                    onClick={() => {
                        setErrors(null);
                        clearErrors(reg as string);
                    }}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default ErrorsPanel;
