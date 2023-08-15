import {
    UilCloudDownload,
    UilImage,
    UilFile,
    UilTimesCircle,
    UilCheck,
    UilFilePlus,
} from "@iconscout/react-unicons";
import { useDropzone } from "react-dropzone";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useHelpers from "../../hooks/fileUploader/useHelpers";
import ErrorsPanel from "./errorsPanel";
import { fileField, errorsField } from "../../utils/interfaces/IFileUpload";
import { useFormContext } from "react-hook-form";

type Props = {
    emptyFiles: boolean;
    shouldEmptyFiles: Dispatch<SetStateAction<boolean>>;
    reg: string;
};
const FileUpload = ({ emptyFiles, shouldEmptyFiles, reg }: Props) => {
    const [files, setFiles] = useState<fileField[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const [errors, setErrors] = useState<errorsField | null>(null);
    const { formState, register } = useFormContext();
    const {
        humanFileSize,
        onDrop,
        removeFile,
        resetFilesFromCorrectReduxState: resetFiles,
    } = useHelpers({
        reg,
        files,
        setFiles,
        setShow,
        setErrors,
    });

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 2,
        maxSize: 4 * 1024 * 1024, //? ~= 4MB
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"],
            "application/pdf": [],
        },
    });

    useEffect(() => {
        if (emptyFiles === true) {
            setFiles([]); //explain: empty files from local state (the one that is used to display the files)
            resetFiles(); //explain: empty files from redux state (the one that is used to send the files to the server)
            setShow(false); //explain: hide the files container
            shouldEmptyFiles(false); //explain: tell the parent component that the files are empty
        }
    }, [emptyFiles]);

    //explain: this useEffect is used to display the required error when no files were given and the submit button was pressed
    useEffect(() => {
        if (formState.errors[reg]?.type === "too_small") {
            setErrors({
                requiredError: true,
                numberError: false,
                sizeErrors: [],
                typeErrors: [],
            });
        }
    }, [formState.errors[reg]]);

    if (errors !== null) {
        return (
            //explain: shows the Errors panel when there is an error
            <ErrorsPanel
                errors={errors}
                humanFileSize={humanFileSize}
                setErrors={setErrors}
                reg={reg}
            />
        );
    } else {
        return (
            <div {...getRootProps()} className="w-full">
                {show && files.length > 0 ? (
                    /* 
                        explain: This is the container where you can view the selected files 
                    */
                    <div className="w-full flex flex-col max-h-52 rounded-xl bg-base-100">
                        <div className="w-full py-4 px-5 flex justify-between items-center bg-base-200 rounded-t-xl">
                            <button
                                className="PrevXnext !bg-base-100 hover:!bg-error hover:text-white"
                                onClick={() => {
                                    setFiles([]);
                                    resetFiles();
                                    setShow(false);
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                className="PrevXnext !bg-base-100 hover:!bg-success hover:text-white disabled:hover:cursor-not-allowed"
                                disabled={files.length >= 2}
                                type="button"
                                onClick={() => setShow(false)}
                            >
                                {files.length < 2 ? (
                                    <span className="flex items-center">
                                        Ajouter <UilFilePlus />
                                    </span>
                                ) : (
                                    <UilCheck className="text-success w-10 h-10" />
                                )}
                            </button>
                        </div>
                        <div className="flex-grow overflow-auto w-full">
                            <div className="grid grid-cols-1 w-full">
                                {files.map((fileObj, index) => (
                                    <div
                                        className={`flex p-5 ${
                                            index < files.length - 1
                                                ? "border-b-2"
                                                : ""
                                        } justify-between items-center`}
                                        key={index}
                                    >
                                        {fileObj.file.type.includes("image") ? (
                                            <UilImage />
                                        ) : (
                                            <UilFile />
                                        )}
                                        <div className="flex mr-auto ml-5">
                                            <h1 className="font-bold hover:cursor-pointer hover:underline">
                                                {fileObj.file.name}
                                            </h1>
                                        </div>
                                        <div className="flex justify-center items-center gap-5 font-medium">
                                            <h1>
                                                (
                                                {humanFileSize(
                                                    fileObj.file.size,
                                                )}
                                                )
                                            </h1>
                                            <span
                                                className="hover:cursor-pointer hover:text-error"
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                            >
                                                <UilTimesCircle />
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* 
                        explain: This is the container where you can drag-nd-drop or load files 
                    */
                    <label
                        htmlFor={`dropZone_${reg}`}
                        className="flex justify-center items-center w-full h-52 border-2 border-dashed  border-base-100 rounded-xl cursor-pointer bg-base-300 hover:bg-base-100"
                    >
                        <div className="flex flex-col items-center justify-center w-full">
                            <UilCloudDownload />
                            {isDragActive ? (
                                <span className="text-sm text-neutral">
                                    Relâchez le fichier ici
                                </span>
                            ) : (
                                <>
                                    {files.length === 1 && (
                                        <span className="text-sm text-neutral">
                                            Fichiers sélectionnés 1/2
                                        </span>
                                    )}
                                    <span className="text-sm text-neutral">
                                        Glissez et déposez un fichier ici ou
                                        cliquez pour le télécharger
                                    </span>
                                    <span className="text-sm text-neutral">
                                        PDF, PNG, JPG ou JPEG (max: 2 fichiers
                                        &#60; 4MB)
                                    </span>
                                </>
                            )}
                        </div>
                        <input
                            {...getInputProps({
                                className: "hidden",
                                id: `dropZone_${reg}`,
                                ...register(reg),
                            })}
                        />
                    </label>
                )}
            </div>
        );
    }
};

export default FileUpload;
