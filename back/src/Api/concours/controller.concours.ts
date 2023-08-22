import { Request, Response, NextFunction } from 'express';
import concoursService from './service.concours';
import httpException from '../../utils/httpException';
import { UploadedFile } from 'express-fileupload';
import attachmentsService from '../attachments/service.attachments';
import { saveFiles } from '../../utils/fileUploaders/saveFiles';

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
            concours
        });
    } catch (err: any) {
        next(new httpException(500, err.message));
    } 
};

export default {
    create,
};
