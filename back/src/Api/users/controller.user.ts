import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import userService from './service.user';
import attachmentService from '../attachments/service.attachments';
import { saveFiles } from '../../utils/fileUploaders/saveFiles';
import { UploadedFile } from 'express-fileupload';
import { generateJWT } from '../../utils/JWT/generateJWT';
import { CandidatAuthRequest } from 'utils/interfaces/ModifiedRequestObject';

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAll();
        res.status(200).json(users);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getOneId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await userService.getOneId(id);
        res.status(200).json(user);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getOneCin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cin } = req.params;
        const user = await userService.getOneCIN(cin);
        res.status(200).json(user);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getOneEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        const user = await userService.getOneEmail(email);
        res.status(200).json(user);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getOneCandidat = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const user = await userService.getByCandidatId(id);
        res.status(200).json(user);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const checkRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, cin } = req.body;
        const userCheck = await userService.checkRegistration(email, cin);

        if (userCheck.cin || userCheck.email) {
            return res
                .status(400)
                .json({ cin: userCheck.cin, email: userCheck.email });
        } else {
            return res.status(200).json({ message: 'ok' });
        }
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const sendMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { recipient } = req.body;
        const hash = await userService.sendMail(recipient);
        return res.status(200).json({ hash });
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { titre, prenom, nom, cin, email, password, naissance, tel } =
            req.body;
        const user = await userService.create(
            titre,
            prenom,
            nom,
            cin,
            email,
            password,
            naissance,
            tel
        );
        return res.status(201).json(user);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const createCandidat = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { titre, prenom, nom, cin, email, password, naissance, tel } =
            req.body;
        let genUser = await userService.create(
            titre,
            prenom,
            nom,
            cin,
            email,
            password,
            naissance,
            tel
        );
        if (genUser) {
            let { relatedPicIds, concoursActifsIds, diplomesIds } = req.body;
            const candidat = await userService.createCandidat(
                genUser.id,
                relatedPicIds,
                concoursActifsIds,
                diplomesIds
            );
            const token = generateJWT({ candidatId: candidat.id }, '1d');
            res.status(201).json({ candidat, token });
        }
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

/*
const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let genUserId = await create(req, res, next);
        if (genUserId) {
            let { isSuperAdmin } = req.body;
            const admin = await userService.createAdmin(
                genUserId,
                isSuperAdmin
            );
            res.status(201).json(admin);
        }
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
}; 
*/

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { adresse, ville, zip } = req.body;
        const user = await userService.update(id, adresse, ville, zip);
        return res.status(200).json(user);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const updateCandidat = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = (req as CandidatAuthRequest).user.candidatId;
        const { adresse, ville, zip } = req.body;
        const candidat = await userService.getByCandidatId(id);
        const updatedUser = await userService.update(
            candidat.user.id,
            adresse,
            ville,
            zip
        );
        return res.status(200).json(updatedUser);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const linkAttachmentsToCandidat = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = (req as CandidatAuthRequest).user.candidatId; 
        const cvFiles = req.files?.cvFiles as (UploadedFile[] | UploadedFile);
        const cinFiles = req.files?.cinFiles as (UploadedFile[] | UploadedFile);

        //*Step 1: save cvfiles and get paths
        const cvsDirPath = `public/candidat_${id}/CVs/`;
        const cvPaths = saveFiles(cvsDirPath, cvFiles);
        
        //*step 2: save cinfiles and get paths
        const cinsDirPath = `public/candidat_${id}/CINs/`;
        const cinPaths = saveFiles(cinsDirPath, cinFiles);

        const attachmentIds: string[] = []; //? this will hold the ids of the created attachments to link them to the candidat later

        //* step3: create attachments for the cv files
        for (const [index, path] of cvPaths.entries()) {
            const attachment = await attachmentService.create(path, 'CV', (Array.isArray(cvFiles)? cvFiles[index]:cvFiles).data, id, undefined, undefined);
            attachmentIds.push(attachment.id);
        }

        //* step4: create attachments for the cin files
        for (const [index, path] of cinPaths.entries()) {
            const attachment = await attachmentService.create(
                path,
                'CIN',
                (Array.isArray(cinFiles) ? cinFiles[index] : cinFiles).data,
                id,
                undefined,
                undefined
            );
            attachmentIds.push(attachment.id);
        }

        //* step5: link attachments to candidat and return the updated candidat
        const updatedCandidat = await userService.linkAttachments(id, attachmentIds);

        return res.status(200).json(updatedCandidat);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await userService.remove(id);
        res.status(200).json(user);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};
const removeMany = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};
const removeAll = async (req: Request, res: Response, next: NextFunction) => {};

export default {
    getAll,
    getOneId,
    getOneCin,
    getOneEmail,
    getOneCandidat,
    checkRegistration,
    sendMail,
    create,
    update,
    remove,
    removeMany,
    removeAll,
    createCandidat,
    updateCandidat,
    linkAttachmentsToCandidat,
    /*   createAdmin, */
};
