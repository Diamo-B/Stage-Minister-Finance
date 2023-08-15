import { Request, Response, NextFunction } from 'express';
import httpException from '../../utils/httpException';
import attachmentService from './service.attachments';
import { CandidatAuthRequest } from 'utils/interfaces/ModifiedRequestObject';

const getByCandidatID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const candidatId  = (req as CandidatAuthRequest).user.candidatId;
        const attachments = await attachmentService.getByCandidatID(candidatId);
        res.status(200).json(attachments);
    } catch (err:any) {
        next(new httpException(500, err.message));
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { path, type, candidatId, concoursId, diplomeId } = req.body;
        const attachment = await attachmentService.create(
            path,
            type,
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
    getByCandidatID,
    create,
    deleteById,
};
