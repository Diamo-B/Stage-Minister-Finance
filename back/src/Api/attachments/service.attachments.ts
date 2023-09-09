import { AttachmentTypes } from '@prisma/client';
import { prisma } from '../../prisma/db.prisma';
import fs from "fs";

const getById = async (id: string) => {
    try {
        return await prisma.attachment.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                path: true,
                type: true,
            },
        });
    } catch (err) {
        throw err;
    }
}

const getAttachmentDataByID = async (id: string) => {
    try {
        return await prisma.attachment.findUnique({
            where: {
                id: id,
            },
            select: {
                data_base64: true,
            },
        });
    } catch (err) {
        throw err;
    }
}

const getByCandidatID = async (candidatId: string) => {
    try {
        return await prisma.attachment.findMany({
            where: {
                candidatId,
            },
            select: {
                id: true,
                path: true,
                type: true,
            }
        })
    } catch (err:any) {
        throw err;
    }
};

const create = async (
    path: string,
    type: AttachmentTypes,
    blob: Buffer,
    candidatId?: string,
    concoursId?: string,
    diplomeId?: string
) => {

    try {
        const attachmentData: any = {
            path,
            type,
            data_base64: blob,
        };

        if (candidatId !== undefined) {
            attachmentData.candidat = {
                connect: {
                    id: candidatId,
                },
            };
        }

        if (concoursId !== undefined) {
            attachmentData.concours = {
                connect: {
                    id: concoursId,
                },
            };
        }

        if (diplomeId !== undefined) {
            attachmentData.diplome = {
                connect: {
                    id: diplomeId,
                },
            };
        }

        return await prisma.attachment.create({
            data: attachmentData,
            select: {
                id: true,
            },
        });
    } catch (err) {
        throw err;
    }
}; 

const deleteById = async (id: string) => {
    try {

        //explain: delete attachment from DB
        const attachment = await prisma.attachment.delete({
            where: {
                id: id,
            },
        });

        //explain: delete attachment from public folder
        try {
            fs.rmSync(attachment.path);
        } catch (fsError) {
            throw fsError;
        }


        return attachment;
    } catch (err) {
        throw err;
    }
};

const deleteAttachments_byDiplome = async (diplomeId: string, paths: string[]) => {
    try {
        //explain: delete attachments from DB
        await prisma.attachment.deleteMany({
            where: {
                diplomeId,
            },
        });
        //explain: delete attachments from public folder
        paths.map((path: string) => {
            try {
                fs.rmSync(path);
            } catch (fsError) {
                throw fsError;
            }
        });
    } catch (err) {
        throw err;
    }
}


export default {
    getById,
    getAttachmentDataByID,
    getByCandidatID,
    create,
    deleteAttachments_byDiplome,
    deleteById,
};
