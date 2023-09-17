import { z } from "zod";
import { base64ToBlob } from "../../../../Utils/base64ToBlobs";
import { activateAlert } from "../../../../Redux/alerts";
import { useAppDispatch } from "../../../redux";
import { Dispatch, SetStateAction } from "react";
import { addAccessPlan, addFinalResults, addSummonedCandidats, addWrittenExamResults } from "../../../../Redux/Admin/concours/results";
import { startGenPageLoading, stopGenPageLoading } from "../../../../Redux/loading";

const useFormHelpers = () => {

    const dispatch = useAppDispatch()

    const fileSchema =z.object({
        name: z.string().nonempty(),
        extension: z.string().nonempty(),
        file: z.string().nonempty(),
    })

    const filesShowcaseSchema = z.object({
            summonedCandidats: z.any(),
            accessPlan: z.any(),
            writtenExamResults: z.any(),
            finalResults: z.any()
        })
   

    const responseSchema = z.object({
        attachments: z.array(z.object({
            id: z.string().uuid().nonempty(),
            path: z.string().nonempty(),
            type: z.enum([ 'summonedCandidats', 'writtenExamResults', 'finalResults', 'accessPlan']),
            base64_file: z.string().nonempty(),
            diplomeId: z.string().uuid().nullable(),
            concoursResultId: z.string().uuid().nullable(),
            concoursId: z.string().uuid().nullable(),
            candidatId: z.string().uuid().nullable()
        }))
    });

    const fetchConcoursResults = (concoursId: string, setFilesShowcases: Dispatch<SetStateAction<z.infer<typeof filesShowcaseSchema>|null>>) => {
        dispatch(startGenPageLoading())
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/concours/${concoursId}/getResults`, {
            method:"get",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("AccessToken")}` 
            }
        }).then(async(res)=>{
            const response: z.infer<typeof responseSchema> = await res.json();
            console.log(response);
            response.attachments.forEach(attachment => {
                const fileName = attachment.path.replace("./public/Concours/", "").split("/")[3];
                const fileExtension = fileName?.split(".")[1];
                const base64Mime = `data:${fileExtension === "pdf"? "application/pdf": `image/${fileExtension}`};base64,`;
                const blob = base64ToBlob(attachment.base64_file, fileExtension === "pdf"? "application/pdf": `image/${fileExtension}`)
                const f = new File([blob], fileName as string, {type: fileExtension === "pdf"? "application/pdf": `image/${fileExtension}`})
                const reduxReducer = attachment.type === "summonedCandidats"? addSummonedCandidats: attachment.type === "accessPlan"? addAccessPlan: attachment.type === "writtenExamResults"? addWrittenExamResults: addFinalResults;
                dispatch(reduxReducer({
                    name: fileName as string,
                    extension: fileExtension as string,
                    file: `${base64Mime}${attachment.base64_file}`
                }))
                setFilesShowcases((prev: z.infer<typeof filesShowcaseSchema> | null) => ({
                    ...(prev || {}), // Ensure prev is not null
                    [attachment.type]: f,
                }));
                
            })
        }).catch((err)=>{
            console.error(err);
        }).finally(()=>{
            dispatch(stopGenPageLoading());
        })
    }
   

    const schema = z.object({
        summonedCandidats: z.array(fileSchema),
        accessPlan: z.array(fileSchema),
        writtenExamResults: z.array(fileSchema),
        finalResults: z.array(fileSchema),
    })

    const saveNewResults = (data: z.infer<typeof schema>, concoursId: string) => {
        console.log(data)
        const fd = new FormData();

        //! This function appends each file object to the FormData
        const appendFilesToFormData = (
            files: z.infer<typeof fileSchema>[],
            propertyName: string,
            formData: FormData
        ):void => {
            files.forEach((file) => {
                const base64Data = file.file.replace(/^data:.*;base64,/, ""); //explain: Remove data URL prefix for any type
                const contentType =
                file.extension === "pdf" ? "application/pdf" : `image/${file.extension}`; //explain: Make the MIME type for the file
                const blob = base64ToBlob(base64Data, contentType); //explain: Convert the base64 to blob
                formData.append(propertyName, blob, file.name); //explain: Append the file to the FormData
            });
        };

        if (data.summonedCandidats.length > 0) {
            appendFilesToFormData(data.summonedCandidats, "summonedCandidats", fd);
        }
        
        if (data.writtenExamResults.length > 0) {
            appendFilesToFormData(data.writtenExamResults, "writtenExamResults", fd);
        }
        
        if (data.finalResults.length > 0) {
            appendFilesToFormData(data.finalResults, "finalResults", fd);
        }
        
        if (data.accessPlan.length > 0) {
            appendFilesToFormData(data.accessPlan, "accessPlan", fd);
        }

        fetch(`${import.meta.env.VITE_BackendBaseUrl}/concours/${concoursId}/setResults`, {
            method: "POST",
            headers:{
                Authorization: `Bearer ${localStorage.getItem("AccessToken")}`
            },
            body: fd
        }).then(async (res)=>{
            const response = await res.json();
            console.log(response);
            if(response.results.id)
            {
                dispatch(activateAlert({
                    level: "alert-success",
                    message: "Les résultats ont été enregistrés avec succès",
                }));
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    return {
        schema,
        saveNewResults,
        fetchConcoursResults,
        filesShowcaseSchema
    }
}
 
export default useFormHelpers;