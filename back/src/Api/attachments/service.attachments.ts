import { AttachmentTypes } from '@prisma/client';
import { prisma } from '../../prisma/db.prisma';
import fs from "fs";
import httpException from '../../utils/httpException';

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

const getAttachmentFileByID = async (id: string) => {
    try {
        return await prisma.attachment.findUnique({
            where: {
                id: id,
            },
            select: {
                file_data: true,
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
            file_data: blob,
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

const deleteByConcoursId = async (concoursId: string) => {
    try {
        const attachment = await prisma.attachment.deleteMany({
            where:{
                concoursId,
            }
        })
        if(!attachment)
        {
            throw new httpException(404, "attachment not found");
        }
        return attachment;
    } catch (err: any) {
        if(err instanceof httpException) throw err;
        throw new httpException(500, err.message);
    }
}


export default {
    getById,
    getAttachmentFileByID,
    getByCandidatID,
    create,
    deleteById,
    deleteAttachments_byDiplome,
    deleteByConcoursId,
};
