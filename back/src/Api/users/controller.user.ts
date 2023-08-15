import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import userService from './service.user';
import attachmentService from '../attachments/service.attachments';
import { saveDiplomas } from '../../utils/fileUploaders/saveDiplomes';
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
            const token  = generateJWT({candidatId: candidat.id}, "1d");
            res.status(201).json({candidat, token});
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
        const CVFiles =
            typeof req.body.CVFiles === 'string'
                ? req.body.CVFiles
                : req.body.CVFiles.map((cv: any) => cv);
        const CINFiles =
            typeof req.body.CINFiles === 'string'
                ? req.body.CINFiles
                : req.body.CINFiles.map((cin: any) => cin);

        const CVExtensions =
            typeof req.body.CVextensions === 'string'
                ? req.body.CVextensions
                : req.body.CVextensions.map((cv: any) => cv);
        const CINExtensions =
            typeof req.body.CINextensions === 'string'
                ? req.body.CINextensions
                : req.body.CINextensions.map((cin: any) => cin);

        const CVFileNames =
            typeof req.body.CVNames === 'string'
                ? req.body.CVNames
                : req.body.CVNames.map((cv: any) => cv);
        const CINFileNames =
            typeof req.body.CINNames === 'string'
                ? req.body.CINNames
                : req.body.CINNames.map((cin: any) => cin);

        //explain: This will the hold the IDs of the createdAttachments so they can be linked to the candidat
        let AttachmentsIDS: string[] = [];

        //!----------------------------------------------------------------------------------------------------------------
        //* CV Attachments (step1)

        //explain: saves the attachement in the public folder and returns the paths
        const cvPaths = saveDiplomas(id, CVFiles, CVFileNames, CVExtensions);

        //explain: create Attachments for each CV file and assign it to the candidat
        for (const path of cvPaths) {
            const attachment = await attachmentService.create(path, 'CV', id);
            AttachmentsIDS.push(attachment.id);
        }

        //!----------------------------------------------------------------------------------------------------------------
        //* CIN Attachments (step2)

        //explain: saves the attachement in the public folder and returns the paths
        const cinPaths = saveDiplomas(id, CINFiles, CINFileNames, CINExtensions);

        //explain: create Attachments for each CIN file and assign it to the candidat
        for (const path of cinPaths) {
            const attachment = await attachmentService.create(path, 'CIN', id);
            AttachmentsIDS.push(attachment.id);
        }

        //!----------------------------------------------------------------------------------------------------------------
        //* Link Attachments to candidat (step3)

        const updatedCandidat = await userService.linkAttachments(
            id,
            AttachmentsIDS
        );

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
