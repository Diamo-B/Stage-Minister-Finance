import { Request, Response, NextFunction } from 'express';
import concoursService from './service.concours';
import httpException from '../../utils/httpException';
import { UploadedFile } from 'express-fileupload';
import { mkdirSync, readdir, rmdir } from 'fs';
import attachmentsService from '../attachments/service.attachments';

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
        const { avis } = req.files as unknown as {
            [fieldname: string]: UploadedFile;
        };

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
        mkdirSync(`./public/Concours/concours_${concours.id}`, { recursive: true });
        avis.mv(
            `./public/Concours/concours_${concours.id}/` + avis.name,
            err => {
                if (err) {
                    console.log('mv err:', err);
                    //remove the made folder if it's empty
                    // Check if the directory is empty
                    readdir(
                        `./public/Concours/concours_${concours.id}/`,
                        (err, files) => {
                            if (err) {
                                console.log(
                                    'readdir err: Could not read directory:',
                                    err
                                );
                            } else if (files.length === 0) {
                                // If the directory is empty, remove it
                                rmdir(
                                    `./public/Concours/concours_${concours.id}/`,
                                    err => {
                                        if (err) {
                                            console.log(
                                                'rmdir err: Could not remove directory:',
                                                err
                                            );
                                        } else {
                                            console.log(
                                                'Removed empty directory: ',
                                                `/public/Concours/concours_${concours.id}/`
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                    throw new httpException(500, err.message);
                }
            }
        );

        //* step3: create attachments linked to the concours
        const attachment = await attachmentsService.newCreate(
            `/public/Concours/concours_${concours.id}/` + avis.name,
            'AVIS',
            avis.data,
            undefined,
            concours.id,
            undefined
        )

        return res.status(201).json({
            concours,
        })
        
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

export default {
    create,
};
