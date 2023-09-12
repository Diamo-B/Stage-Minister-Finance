import { concoursStatus } from '@prisma/client';
import { prisma } from '../../prisma/db.prisma';
import dayjs from 'dayjs';
import httpException from '../../utils/httpException';
import { rm } from 'fs';

const getAll = async () => {
    const concours = await prisma.concours.findMany({
        select: {
            id: true,
            label: true,
            direction: true,
            poste: true,
            grade: true,
            specialite: true,
            branche: true,
            avis: {
                select:{
                    id: true,
                    path: true,
                }
            },
            candidats: {
                include:{
                    user: {
                        select:{
                            id: true,
                            adresse: true,
                            cin: true,
                            dateNaissance: true,
                            email: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            titre: true,

                        }
                    },
                }
            },
            dateConcours: true,
            datePublication: true,
            dateLimiteInscription: true,
            limiteAge: true,
            limitePlaces:true,
            status: true,
            villes:{
                select:{
                    id: true,
                    nom: true
                }
            }
        }
    });
    return concours;
};

const getById = async (id: string) => {
    try {
        const concours = await prisma.concours.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                label: true,
                status: true,
                directionId: true,
                posteId: true,
                gradeId: true,
                specialiteId: true,
                brancheId: true,
                limitePlaces:true,
                limiteAge: true,
                datePublication: true,
                dateLimiteInscription: true,
                dateConcours: true,
                campagneId: true,
                avis: {
                    select:{
                        id: true,
                        path: true,
                    }
                },
                candidats: true,
                villes: {
                    select:{
                        id: true,
                    }
                },
            }
        });
        if(!concours)
        {
            throw new httpException(404, "Aucun concours ne possède l'id: " + id);
        }
        else
        {
            return concours;
        }
    } catch (err: any) {
        if(err instanceof httpException) throw err;
        throw new httpException(500, err.message);
    }
}

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
                        id: true,
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

const update = async (
    updatedData: any,
    id: string
) => {
    try {
        const concours = await prisma.concours.update({
            where: {
                id: id,
            },
            data: {
                ...updatedData,
            },
        });
        if(!concours)
            throw new httpException(404, "Aucun concours ne possède l'id: " + id);
        return concours;
    } catch (err) {
        throw err;    
    }
};

const remove = async (id: string) => {
    try {
        
        const concours = await prisma.concours.delete({
            where: {
                id: id,
            },
        });
        if(!concours)
            throw new httpException(404, "Aucun concours ne possède l'id: " + id);
        else
        {
            //explain: removes the concours folder (avis) from the public folder
            const dirPath = `./public/Concours/concours_${concours.id}/`;
            rm(dirPath, { recursive: true }, 
                (err) => {
                    if (err) throw err;
                }
            );
        }
        return concours;
    } catch (err) {
        throw err;    
    }
}

export default {
    getAll,
    getById,
    getAll_W_UsefulPropsOnly,
    getAll_W_usefulProps_userAssignments,
    create,
    update,
    remove,
};
