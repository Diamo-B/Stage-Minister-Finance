import { Request, Response, NextFunction } from 'express';
import concoursService from './service.concours';
import httpException from '../../utils/httpException';
import { UploadedFile } from 'express-fileupload';
import attachmentsService from '../attachments/service.attachments';
import { saveFiles } from '../../utils/fileUploaders/saveFiles';
import { UserAuthRequest } from '../../utils/interfaces/ModifiedRequestObject';
import { existsSync, readdirSync, rm, rmdirSync, statSync, unlinkSync } from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';
import { Attachment, AttachmentTypes, Concours } from '@prisma/client';
import arraysAreEqual from '../../utils/compareArrays';

const create = async (req: Request, res: Response, next: NextFunction) => {
    const {
        label,
        directionId,
        posteId,
        gradeId,
        brancheId,
        specialiteId,
        maxPlaces,
        maxAge,
        dateLimiteDepot,
        dateConcours,
        villesIds,
    } = req.body;
    try {
        const avis = req.files?.avis as UploadedFile;

        //* step0: Get the villesId then parse it since it came as a JSON string
        const villesIdsArr = JSON.parse(villesIds);

        //* step1: create concours
        const concours = await concoursService.create(
            label,
            'enabled',
            directionId,
            posteId,
            gradeId,
            specialiteId,
            brancheId,
            parseInt(maxPlaces),
            parseInt(maxAge),
            villesIdsArr,
            dateLimiteDepot,
            dateConcours
        );

        //* step2: save avis file to the public folder
        //explain: saves the attachement in the public folder and returns the paths
        const dirPath = `./public/Concours/concours_${concours.id}/avis/`;
        const filesPaths = saveFiles(dirPath, avis);

        //* step3: create attachments linked to the concours
        const attachment = await attachmentsService.create(
            filesPaths[0],
            'AVIS',
            avis.data,
            undefined,
            concours.id,
            undefined,
            undefined
        );

        return res.status(201).json({
            concours,
        });
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const setResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { concoursId } = req.params;
        const summonedCandidatsFile = req.files
            ?.summonedCandidats as UploadedFile;
        const writtenExamResults = req.files
            ?.writtenExamResults as UploadedFile;
        const finalResults = req.files?.finalResults as UploadedFile;
        const accessPlan = req.files?.accessPlan as UploadedFile;
        
        //* step1: get or create the Results record in the db then link it to this concours
        const resultsRecord = await concoursService.createOrGetConcoursResultRecord(concoursId);

        const GenDirPath = `./public/Concours/concours_${concoursId}/Results`;

        async function removeFileWhenUndefined(type: 'summonedCandidats' | 'writtenExamResults' | 'finalResults' | 'accessPlan'): Promise<boolean> {
            let status = false;

            const fileData = req.files?.[type] as UploadedFile;
            if(fileData === undefined)
            {
                status = true;
                const folderPath = GenDirPath + `/${type}/`;
                function emptyFolder(folderPath: string) {
                    // Check if the directory exists
                    if (existsSync(folderPath)) {
                        // Get a list of all files and subdirectories in the folder
                        const items = readdirSync(folderPath);

                        // Loop through each item and remove it (file or directory)
                        for (const item of items) {
                            const itemPath = path.join(folderPath, item);

                            // Check if it's a file
                            if (statSync(itemPath).isFile()) {
                                // If it's a file, delete it
                                unlinkSync(itemPath);
                            } else {
                                // If it's a directory, recursively empty it and then remove it
                                emptyFolder(itemPath);
                                rmdirSync(itemPath);
                            }
                        }
                    }
                }
                emptyFolder(folderPath);

                //explain: remove the attachment from the database
                await attachmentsService.deleteByConcoursResultId(resultsRecord.id, type);
            }

            return status
        }

        async function equalFiles(type: 'summonedCandidats' | 'writtenExamResults' | 'finalResults' | 'accessPlan') {
            const folderPath = GenDirPath+`/${type}/`; //explain: Make the path that will be used to verify the presence of an old file

            if (!existsSync(folderPath)) {
                //explain: first time, save the new file
                return null;
            }
            const folderFiles = readdirSync(folderPath); //explain: get the names of the files inside the folder 

            if(folderFiles.length === 0) //explain: empty folder
                return null; //explain: first time, save the new file
            else
            {
                //* step2: turn the uploaded file and the existing one into base64
                const existingFilePath = folderPath + folderFiles[0]; //explain: setting the path of the existing file
                const existingFileContent = (
                    await readFile(existingFilePath)
                ).toString('base64'); //explain:getting the content of the existing file

                //* Step3: getting the content of the uploaded file
                //explain: getting the uploadedFile object based on the type
                const uploadedFile = req.files?.[type] as UploadedFile;

                const uploadedFileContent =
                    uploadedFile.data.toString('base64');

                //* step4: compare the two files then return the result
                const areFilesEqual = existingFileContent === uploadedFileContent; //explain: true => don't do a thing / false => empty the folder then save the new file

                return { areFilesEqual, existingFilePath };
            }
        }

        async function removeExisting_saveNew(
            areFilesEqual: boolean,
            type:
                | 'summonedCandidats'
                | 'writtenExamResults'
                | 'finalResults'
                | 'accessPlan',
            existingFilePath: string
        ): Promise<{id: string} | null | undefined> {
            //explain: if the files are equal then removes the existing file if so, removes the attachment for it from the db, then call the saveNewFile function
            let attachment;
            if (!areFilesEqual) {
                rm(existingFilePath, async err => {
                    if (err) {
                        throw new httpException(500, err.message);
                    } else {
                        //explain: file deleted successfully

                        //* step3.2: remove the attachment from the database
                        await attachmentsService.deleteByConcoursResultId(
                            resultsRecord.id,
                            type
                        );
                        attachment = await saveNewFile(type);
                    }
                });
            }
            return attachment;
        }

        async function saveNewFile (
            type: 'summonedCandidats' | 'writtenExamResults' | 'finalResults' | 'accessPlan'
        ): Promise<{id: string} | null | undefined> {
            //explain: setting the new file according to the data
            let fileData = req.files?.[type] as UploadedFile;
            let attachment;
            //explain: save the new file to the public folder 
            if(fileData)
            {
                const filesPaths = saveFiles(`${GenDirPath}/${type}/`, fileData);
                if(filesPaths.length>0)
                {
                    //explain: create a new attachment in the database
                    attachment = await createAttachment(filesPaths[0], fileData, type);
                }
            }
            return attachment;
        }

        async function createAttachment(
            filePath: string,
            file: UploadedFile | undefined,
            attachmentType: AttachmentTypes,
        ): Promise<{id: string}|null|undefined> {
            if (file) {
                const attachment = await attachmentsService.create(
                    filePath,
                    attachmentType,
                    file.data,
                    undefined,
                    undefined, 
                    undefined,
                    resultsRecord.id
                );

                return attachment;
            } else 
                return null;
        }
       
        //! this is the function that launches the whole process !!
        async function MainProcess (
            type: 'summonedCandidats' | 'writtenExamResults' | 'finalResults' | 'accessPlan'
        ): Promise<{id: string}|null|undefined>{
            const isUndefined = await removeFileWhenUndefined(type);
            
            if (isUndefined)
                return null;
            const response = await equalFiles(type);
            if(response !== null)
            {
                const attachment = await removeExisting_saveNew(
                    response.areFilesEqual,
                    type,
                    response.existingFilePath
                );
                if(attachment !== null && attachment !== undefined)
                    return attachment;
            }
            else
            {
                //explain: directly save the file
                const attachment = await saveNewFile(type);
                if(attachment !== null && attachment !== undefined)
                    return attachment;
            }

        }
        
        const summonedCandidatsAttachment = await MainProcess('summonedCandidats'); //!null
        const WrittenExamAttachment = await MainProcess('writtenExamResults');//! null
        const finalResultsAttachment = await MainProcess('finalResults');//! null
        const accessPlanAttachment = await MainProcess('accessPlan');//! null

        console.log(
            summonedCandidatsAttachment,
            WrittenExamAttachment,
            finalResultsAttachment,
            accessPlanAttachment
        );
        

        const results = await concoursService.setResults(
            resultsRecord.id,
            summonedCandidatsAttachment?.id,
            WrittenExamAttachment?.id,
            finalResultsAttachment?.id,
            accessPlanAttachment?.id
        );

        return res.status(201).json({ results }); 
    } catch (err:any) {
        if(err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
    
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    const {
        label,
        directionId,
        posteId,
        gradeId,
        brancheId,
        specialiteId,
        maxPlaces,
        maxAge,
        dateLimiteDepot,
        dateConcours,
        villesIds,
    } = req.body;
    try {
        const avis = req.files?.avis as UploadedFile;
        const id = req.params.id;

        //* step0: Get the villesId then parse it since it came as a JSON string
        const villesIdsArr = JSON.parse(villesIds);

        //* step1: get the file path inside the specific concours folder
        const publicFolderPath = path.join(
            __dirname,
            '../../../public/Concours/concours_' + id + '/avis/'
        );
        const files = readdirSync(publicFolderPath);
        const existingConcoursAvisPath = publicFolderPath + files[0];

        //* step2: turn the uploaded file and the existing file into base64 strings
        const uploadedFileContent = avis.data.toString('base64');
        const existingAvisContent = (
            await readFile(existingConcoursAvisPath)
        ).toString('base64');

        //* step3: compare the two files, if they are identical, don't change a thing, if they are not, delete the existing file and save the new one (in both the public folder and the attachments table)
        const areFilesEqual = uploadedFileContent === existingAvisContent;

        let attachment: Pick<Attachment, 'id'> = { id: '' };

        if (!areFilesEqual) {
            //* step3.1 : delete the existing file from the public folder
            rm(existingConcoursAvisPath, async err => {
                if (err) {
                    throw new httpException(500, err.message);
                } else {
                    //explain: file deleted successfully
                    //* step3.2: remove the attachment from the database
                    await attachmentsService.deleteByConcoursId(id, 'AVIS');

                    //* step3.3: save the new file to the public folder
                    const filesPaths = saveFiles(
                        './public/Concours/concours_' + id + '/avis/',
                        avis
                    );

                    //* step3.4: create a new attachment in the database
                    attachment = await attachmentsService.create(
                        filesPaths[0],
                        'AVIS',
                        avis.data,
                        undefined,
                        id,
                        undefined
                    );
                }
            });
        }
        //*Step4: get the original concours
        const originalConcours: Concours & {
            villes: { id: string }[];
        } = await concoursService.getById(id);

        //*Step5: update the concours
        const updateData: any = {
            label: originalConcours.label !== label ? label : undefined,
            direction: {
                connect: {
                    id:
                        originalConcours.directionId !== directionId
                            ? directionId
                            : undefined,
                },
            },
            poste: {
                connect: {
                    id:
                        originalConcours.posteId !== posteId
                            ? posteId
                            : undefined,
                },
            },
            grade: {
                connect: {
                    id:
                        originalConcours.gradeId !== gradeId
                            ? gradeId
                            : undefined,
                },
            },
            specialite: {
                connect: {
                    id:
                        originalConcours.specialiteId !== specialiteId
                            ? specialiteId
                            : undefined,
                },
            },
            branche: {
                connect: {
                    id:
                        originalConcours.brancheId !== brancheId
                            ? brancheId
                            : undefined,
                },
            },
            limitePlaces:
                originalConcours.limitePlaces !== parseInt(maxPlaces)
                    ? parseInt(maxPlaces)
                    : undefined,
            limiteAge:
                originalConcours.limiteAge !== parseInt(maxAge)
                    ? parseInt(maxAge)
                    : undefined,
            dateLimiteInscription:
                originalConcours.dateLimiteInscription !== dateLimiteDepot
                    ? dateLimiteDepot
                    : undefined,
            dateConcours:
                originalConcours.dateConcours !== dateConcours
                    ? dateConcours
                    : undefined,
            avis: {
                connect: {
                    id:
                        attachment && attachment.id !== ''
                            ? attachment.id
                            : undefined,
                },
            },
        };

        //? add the villes to the updatedData
        const originalVilles = originalConcours.villes.map(ville => ville.id);
        const newVilles = villesIdsArr;
        if (
            arraysAreEqual(originalVilles, newVilles) ||
            (newVilles.length === 0 && originalVilles.length === 0)
        ) {
            updateData.villes = undefined;
        } else {
            updateData.villes = {
                set: newVilles.map((villeId: string) => {
                    return { id: villeId };
                }),
            };
        }

        // Remove properties with undefined values
        for (const key in updateData) {
            const normalFields = [
                'label',
                'limitePlaces',
                'limiteAge',
                'dateLimiteInscription',
                'dateConcours',
            ];
            if (normalFields.includes(key)) {
                updateData[key] === undefined && delete updateData[key];
            } else if (key === 'villes') {
                //TODO: there may be other conditions for the villes (needs more checking)
                if (updateData[key] === undefined) delete updateData[key];
            } else {
                updateData[key].connect.id === undefined &&
                    delete updateData[key];
            }
        }

        const updatedConcours = await concoursService.update(updateData, id);

        return res.status(200).json(updatedConcours);
    } catch (err: any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
};

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const concours = await concoursService.getAll();
        return res.status(200).json({
            concours,
        });
    } catch (err: any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const concours = await concoursService.getById(id);
        return res.status(200).json({
            concours,
        });
    } catch (err: any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
};

const getAll_W_UsefulPropsOnly = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const concours = await concoursService.getAll_W_UsefulPropsOnly();
        return res.status(200).json({
            concours,
        });
    } catch (err: any) {
        if (err instanceof httpException) {
            return res.status(err.status).json({
                message: err.message,
            });
        }
        next(new httpException(500, err.message));
    }
};

const getAll_W_usefulProps_userAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user: decodedToken } = req as UserAuthRequest;
        const candidatId = decodedToken.user.candidat?.id;
        const concours =
            await concoursService.getAll_W_usefulProps_userAssignments(
                candidatId
            );
        return res.status(200).json({ concours });
    } catch (err: any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
};

const getExaminationSiteDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { concoursId } = req.params;
        const examinationData = await concoursService.getExaminationSiteDetails(
            concoursId
        );
        return res.status(200).json(examinationData);
    } catch (err: any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
};

const getAllConcoursResults = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const results = await concoursService.getAllConcoursResults();
        const organizedResults = results.map(singleResult => {
            return {
                id: singleResult.id,
                label: singleResult.label,
                direction: singleResult.direction,
                poste: singleResult.poste,
                grade: singleResult.grade,
                dateConcours: singleResult.dateConcours,
                limitePlaces: singleResult.limitePlaces,
                status: singleResult.status,
                resultFilesPaths: {
                    summonedCandidats: singleResult.result?.attachments.find(
                        attachment => attachment.type === 'summonedCandidats'
                    )?.path,
                    writtenExamResults: singleResult.result?.attachments.find(
                        attachment => attachment.type === 'writtenExamResults'
                    )?.path,
                    finalResults: singleResult.result?.attachments.find(
                        attachment => attachment.type === 'finalResults'
                    )?.path,
                    accessPlan: singleResult.result?.attachments.find(
                        attachment => attachment.type === 'accessPlan'
                    )?.path,
                },
            };
        })
        return res.status(200).json(organizedResults);
    } catch (err: any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
}

const getSingleConcoursResults = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { concoursId } = req.params;
        const results = await concoursService.getSingleConcoursResults(
            concoursId
        );
        let base64Attachments:any = [];
        results?.attachments?.forEach(attachment => {
            base64Attachments.push({
                id: attachment.id,
                concoursId: attachment.concoursId,
                concoursResultId: attachment.concoursResultId,
                base64_file: attachment.file_data?.toString('base64'),
                type: attachment.type,
                path: attachment.path,
            })
        })
        results.attachments = base64Attachments;
        return res.status(200).json(results);
    } catch (err: any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
};

const ChangeExaminationSiteDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { concoursId } = req.params;
        const { newCitiesAssignments } = req.body;
        const newExaminationData =
            await concoursService.changeExaminationSiteDetails(
                concoursId,
                newCitiesAssignments
            );
        return res.status(200).json(newExaminationData);
    } catch (err: any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
};

const updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.body;
        const concours = await concoursService.endConcours(id);
        return res.status(200).json({
            concours,
        });
    } catch (err: any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admin = (req as UserAuthRequest).user.user.admin.id;
        if (!admin) {
            throw new httpException(401, 'Unauthorized');
        }
        const { id } = req.params;
        const concours = await concoursService.remove(id);
        return res.status(200).json({
            concours,
        });
    } catch (err: any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
};

export default {
    getAll,
    getById,
    getAll_W_UsefulPropsOnly,
    getAll_W_usefulProps_userAssignments,
    getExaminationSiteDetails,
    getAllConcoursResults,
    getSingleConcoursResults,
    ChangeExaminationSiteDetails,
    create,
    setResults,
    update,
    updateStatus,
    remove,
};
