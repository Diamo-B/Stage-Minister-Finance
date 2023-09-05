import { concoursStatus } from '@prisma/client';
import { prisma } from '../../prisma/db.prisma';
import dayjs from 'dayjs';
import httpException from '../../utils/httpException';

const getAll = async () => {
    const concours = await prisma.concours.findMany({
        include: {
            direction: true,
            poste: true,
            grade: true,
            specialite: true,
            branche: true,
            villes: true,
            avis: true,
            campagne: true
        },
    });
    return concours;
};

const getAll_W_UsefulPropsOnly = async () => {
    const concours = await prisma.concours.findMany({
        select: {
            id: true,
            label: true,
            status: true,
            datePublication: true,
            dateLimiteInscription: true,
            dateConcours: true,
            limiteAge: true,
            limitePlaces: true,
            campagneId: true,
            avis: {
                select:{
                    path: true,
                }
            },
        }
    });
    return concours;
};

const getAll_W_usefulProps_userAssignments = async (userId: string) => {
    try {
        const concours = await prisma.concours.findMany({
            select: {
                id: true,
                label: true,
                status: true,
                datePublication: true,
                dateLimiteInscription: true,
                dateConcours: true,
                limiteAge: true,
                limitePlaces: true,
                campagneId: true,
                avis: {
                    select:{
                        path: true,
                    }
                },
                candidats: {
                    select: {
                        id: true,                      
                    },
                    where: {
                        id: userId,
                    },
                },
            },
        });
        if(!concours || concours.length === 0)
            throw new httpException(404, "Aucun concours n'est trouvé");
        return concours;
    } catch (err) {
        throw err
    }
}

const create = async (
    label: string,
    status: concoursStatus,
    directionId: string,
    posteId: string,
    gradeId: string,
    specialiteId: string,
    brancheId: string,
    limitePlaces: number,
    limiteAge: number,
    villesIds: string[],
    dateLimiteInscription: string,
    dateConcours: string
) => {
    const concours = await prisma.concours.create({
        data: {
            label: label,
            status: status,
            direction: {
                connect: {
                    id: directionId,
                },
            },
            poste: {
                connect: {
                    id: posteId,
                },
            },
            grade: {
                connect: {
                    id: gradeId,
                },
            },
            specialite: {
                connect: {
                    id: specialiteId,
                },
            },
            branche: {
                connect: {
                    id: brancheId,
                },
            },
            limitePlaces: limitePlaces,
            limiteAge: limiteAge,
            villes: {
                connect:
                    villesIds && villesIds.length > 0
                        ? villesIds.map(id => ({ id }))
                        : [],
            },
            dateLimiteInscription: dateLimiteInscription,
            dateConcours: dateConcours,
            datePublication: dayjs().format('DD-MM-YYYY'),
        },
    });
    return concours;
};

export default {
    getAll,
    getAll_W_UsefulPropsOnly,
    getAll_W_usefulProps_userAssignments,
    create,
};
