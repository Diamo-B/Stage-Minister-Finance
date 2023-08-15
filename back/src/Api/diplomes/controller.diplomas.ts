import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import diplomaService from './service.diplomas';
import attachmentService from '../attachments/service.attachments';
import { saveDiplomas } from '../../utils/fileUploaders/saveDiplomes';
import { CandidatAuthRequest } from '../../utils/interfaces/ModifiedRequestObject';
import fs from "fs"

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const diplomes = await diplomaService.getAll();
        res.status(200).json(diplomes);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getAllByCandidatId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = (req as CandidatAuthRequest).user.candidatId;
        const diplomes = await diplomaService.getAllByCandidatId(id);
        res.status(200).json(diplomes);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getAllDiplomeTypes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const diplomeTypes = await diplomaService.getAllDiplomeTypes();
        res.status(200).json(diplomeTypes);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getAllDiplomeFillieres = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const filieres = await diplomaService.getAllDiplomeFilieres();
        res.status(200).json(filieres);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getAllDiplomeSpecialities = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const specs = await diplomaService.getAllDiplomeSpecialities();
        res.status(200).json(specs);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
    const {
        intitule,
        type,
        filiere,
        annee,
        pays,
        etablissement,
        specialite,
        files,
        name,
        ext,
    } = req.body;
    try {
        const candidat = (req as CandidatAuthRequest).user.candidatId;
        //explain: saves the attachement in the public folder and returns the paths
        const filesPaths = saveDiplomas(candidat, files, name, ext);

        //explain: create Attachments for each file and assign it to the candidat
        let attachments: string[]= [];
        for(const path of filesPaths) {
            const attachment = await attachmentService.create(path, 'DIPLOME', candidat);
            attachments.push(attachment.id);
        }
        
        //explain: create a Diploma and assign it to the candidat
        const diploma = await diplomaService.create(
            intitule,
            type,
            filiere, //affiliation
            annee,
            pays,
            etablissement,
            specialite,
            candidat,
            attachments
        ); 

        return res.status(201).json(diploma);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const deleteDiplome = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const { diplomeId, attachments } = req.body;
        //explain: delete the attachments from DB and public folder
        await attachmentService.deleteAttachments_byDiplome(diplomeId,attachments.map((attachment: {path: string})=>attachment.path));

        const deletedDiplome = await diplomaService.deleteDiplome(
            diplomeId
        );
        res.status(200).json(deletedDiplome);
    }
    catch(err:any)
    {
        next(new httpException(500, err.message));
    }
}

export default {
    getAll,
    getAllByCandidatId,
    getAllDiplomeTypes,
    getAllDiplomeFillieres,
    getAllDiplomeSpecialities,
    create,
    deleteDiplome
};
