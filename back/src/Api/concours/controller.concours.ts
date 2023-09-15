import { Request, Response, NextFunction } from 'express';
import concoursService from './service.concours';
import httpException from '../../utils/httpException';
import { UploadedFile } from 'express-fileupload';
import attachmentsService from '../attachments/service.attachments';
import { saveFiles } from '../../utils/fileUploaders/saveFiles';
import { UserAuthRequest } from '../../utils/interfaces/ModifiedRequestObject';
import { readdirSync, rm } from 'fs';
import path from 'path';
import { readFile } from 'fs/promises';
import { Attachment, Concours } from '@prisma/client';
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
        const dirPath = `./public/Concours/concours_${concours.id}/`;
        const filesPaths = saveFiles(dirPath, avis);

        //* step3: create attachments linked to the concours
        const attachment = await attachmentsService.create(
            filesPaths[0],
            'AVIS',
            avis.data,
            undefined,
            concours.id,
            undefined
        );

        return res.status(201).json({
            concours,
        });
    } catch (err: any) {
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
            '../../../public/Concours/concours_' + id + '/'
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
                    await attachmentsService.deleteByConcoursId(id);

                    //* step3.3: save the new file to the public folder
                    const filesPaths = saveFiles('./public/Concours/concours_' + id + '/', avis);

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
        if(arraysAreEqual(originalVilles, newVilles) || (newVilles.length === 0 && originalVilles.length === 0))
        {
            updateData.villes = undefined;
        }
        else
        {
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
            if (normalFields.includes(key))
            {
                updateData[key] === undefined && delete updateData[key]; 
            }
            else if( key === 'villes')
            { 
                //TODO: there may be other conditions for the villes (needs more checking)
                if (updateData[key] === undefined)
                    delete updateData[key];
            }
            else
            {
                updateData[key].connect.id === undefined && delete updateData[key];
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

const getExaminationSiteDetails = async ( req:Request, res:Response, next:NextFunction) => {
    try {
        const {concoursId} = req.params;
        const examinationData = await concoursService.getExaminationSiteDetails(concoursId);
        return res.status(200).json(examinationData);
    } catch (err: any) {
        if(err instanceof httpException) next(err)
        next(new httpException(500, err.message));
    }
}

const ChangeExaminationSiteDetails = async ( req:Request, res:Response, next:NextFunction) => {
    try {
        const { concoursId } = req.params;
        const { newCitiesAssignments } = req.body;
        const newExaminationData = await concoursService.changeExaminationSiteDetails(
            concoursId, newCitiesAssignments
        );
        return res.status(200).json(newExaminationData);
    } catch (err:any) {
        if (err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
}

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
}

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
    ChangeExaminationSiteDetails,
    create,
    update,
    updateStatus,
    remove,
};
