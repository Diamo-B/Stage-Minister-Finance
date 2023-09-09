import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import attachmentService from './service.attachments';
import { UserAuthRequest } from 'utils/interfaces/ModifiedRequestObject';

const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const attachment = await attachmentService.getById(id);
        res.status(200).json(attachment);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getAttachmentDataByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const attachment = await attachmentService.getAttachmentDataByID(id);
        res.status(200).json(attachment);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const getByCandidatID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidatId  = (req as UserAuthRequest).user.candidatId;
        const attachments = await attachmentService.getByCandidatID(candidatId);
        res.status(200).json(attachments);
    } catch (err:any) {
        next(new httpException(500, err.message));
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { path, type, base64, candidatId, concoursId, diplomeId } = req.body;
        const attachment = await attachmentService.create(
            path,
            type,
            base64,
            candidatId,
            concoursId,
            diplomeId
        );
        res.status(200).json(attachment);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const deleteById = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const attachment = await attachmentService.deleteById(id);
        res.status(200).json(attachment);
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};


export default {
    getAttachmentDataByID,
    getById,
    getByCandidatID,
    create,
    deleteById,
};
