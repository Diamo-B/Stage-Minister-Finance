import { useCallback } from "react";
import {
    fileField,
    errorsField,
    error,
} from "../../Utils/interfaces/IFileUpload";
import { FileRejection } from "react-dropzone";

import {
    addFile as addFileStep4,
    removeFile as removeFileStep4,
    resetFiles as resetFilesStep4,
} from "../../Redux/RegisterationForm/diplomes";
import {
    addCINFile as addCINFileStep5,
    addCVFile as addCVFileStep5,
    removeCINFile as removeCINFileStep5,
    removeCVFile as removeCVFileStep5,
    resetCINFiles as resetCINFilesStep5,
    resetCVFiles as resetCVFilesStep5,
} from "../../Redux/RegisterationForm/lastStep";

import convertBase64 from "../../Utils/convertBase64";
import { addAvis, removeAvis, resetAvis } from "../../Redux/Admin/concours/create";
import { useAppDispatch } from "../redux";

type Props = {
    reg: string;
    files: fileField[];
    setFiles: React.Dispatch<React.SetStateAction<fileField[]>>;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    setErrors: React.Dispatch<React.SetStateAction<errorsField | null>>;
};

const useHelpers = ({ reg, files, setFiles, setShow, setErrors }: Props) => {
    const dispatch = useAppDispatch();

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]): void => {
            if (fileRejections.length > 0) {
                const arr: error[] = [
                    ...fileRejections.map(rej => {
                        return {
                            code: rej.errors[0].code,
                            file: rej.file.name,
                            size: rej.file.size,
                            type: getFileExtension(rej.file),
                        };
                    }),
                ];

                const sizeErrors = arr.filter(
                    err => err.code === "file-too-large",
                );
                const numberError = arr.length > 2;
                const typeErrors = arr.filter(
                    err => err.code === "file-invalid-type",
                );
                setErrors({
                    sizeErrors,
                    numberError,
                    typeErrors,
                    requiredError: false,
                });
            }
            if (files.length < 2) {
                setFiles(prev => [
                    ...prev,
                    ...acceptedFiles.map(file => {
                        return { file };
                    }),
                ]);
                acceptedFiles.forEach(file => {
                    convertBase64(file).then(async base64 => {
                        addFileToCorrectReduxState({
                            file: base64 as string,
                            name: file.name,
                            extension: getFileExtension(file),
                        });
                    });
                });
            }
            setShow(true);
        },
        [files, setFiles, setShow, setErrors],
    );

    function getFileExtension(file: File): string {
        const parts = file.name.split(".");
        if (parts.length > 1) return parts.pop() as string;
        else return "";
    }

    const humanFileSize = (bytes: number, si = false, dp = 1): string => {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + " B";
        }

        const units = si
            ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
            : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (
            Math.round(Math.abs(bytes) * r) / r >= thresh &&
            u < units.length - 1
        );

        return bytes.toFixed(dp) + " " + units[u];
    };

    const removeFile = (index: number): void => {
        // Create a new array without the selected item
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        removeFileFromCorrectReduxState(index);
        setFiles(updatedFiles); // Update the state with the new array
    };

    const addFileToCorrectReduxState = (data: {
        file: string;
        name: string;
        extension: string;
    }) => {
        switch (reg) {
            case "files": //explain: Diplomas related files (step 4)
                dispatch(
                    addFileStep4({
                        file: data.file,
                        name: data.name,
                        extension: data.extension,
                    }),
                );
                break;
            case "CV": //explain: CV related files (step 5)
                dispatch(
                    addCVFileStep5({
                        file: data.file,
                        name: data.name,
                        extension: data.extension,
                    }),
                );
                break;
            case "CIN": //explain: CIN related files (step 5)
                dispatch(
                    addCINFileStep5({
                        file: data.file,
                        name: data.name,
                        extension: data.extension,
                    }),
                );
                break;
            case "avis": //explain: concours avis file (page /admin/concours/create)
                dispatch(
                    addAvis({
                        file: data.file,
                        name: data.name,
                        extension: data.extension,
                    })
                );
                break;
        }
    };

    const removeFileFromCorrectReduxState = (index: number) => {
        switch (reg) {
            case "files": //explain: Diplomas related files (step 4)
                dispatch(removeFileStep4(index));
                break;
            case "CV": //explain: CV related files (step 5)
                dispatch(removeCVFileStep5(index));
                break;
            case "CIN": //explain: CIN related files (step 5)
                dispatch(removeCINFileStep5(index));
                break;
            case "avis": //explain: concours avis file (page /admin/concours/create)
                dispatch(removeAvis(index));
                break;
        }
    };

    const resetFilesFromCorrectReduxState = () => {
        switch (reg) {
            case "files": //explain: Diplomas related files (step 4)
                dispatch(resetFilesStep4());
                break;
            case "CV": //explain: CV related files (step 5)
                dispatch(resetCVFilesStep5());
                break;
            case "CIN": //explain: CIN related files (step 5)
                dispatch(resetCINFilesStep5());
                break;
            case "avis": //explain: concours avis file (page /admin/concours/create)
                dispatch(resetAvis());
                break;
        }
    };

    return {
        onDrop,
        humanFileSize,
        removeFile,
        resetFilesFromCorrectReduxState,
    };
};

export default useHelpers;
