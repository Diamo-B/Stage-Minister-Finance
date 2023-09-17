import { Attachment, concoursStatus } from '@prisma/client';
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
                            ville:{
                                select:{
                                    id: true,
                                    nom: true
                                }
                            }
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
                    nom: true,
                    users: true
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

const getExaminationSiteDetails = async (concoursId: string) => {
    try {
        const concoursExaminationData = await prisma.ville_examen_candidat.findMany({
            where:{
                concoursId: concoursId,
            },
            include:{
                candidat:{
                    select:{
                        id: true,
                        user:{
                            select:{
                                titre:true,
                                nom: true,
                                prenom:true,
                                cin:true,
                                email:true,
                                ville:{
                                    select:{
                                        id: true,
                                        nom: true
                                    }
                                }
                            }
                        }
                    }
                },
                concours:{
                    include:{
                        villes:{
                            select:{
                                id: true,
                                nom: true
                            }
                        }
                    }
                },
                villeExamen: {
                    select:{
                        id: true,
                        nom: true,
                    }
                }
            }
        })
        if(!concoursExaminationData || concoursExaminationData.length === 0)
            throw new httpException(404, "Aucun concours n'est trouvé");
        return concoursExaminationData;
    } catch (err) {
        throw err;
    }
}

const getResults = async (concoursId: string) => {
    try {
        const concoursResults = await prisma.concoursResult.findUnique({
            where:{
                concoursId: concoursId,
            },
            include:{
                attachments: true,
                concours:{
                    select:{
                        label: true
                    }
                }
            }
        })
        if(!concoursResults)
            throw new httpException(404, "Ce concours n'as pas encore un résultat");
        /* concoursResults.attachments.map((attachment) => {
            attachment.attachmentData = attachment.file_data.toString('base64');
        }) */
        return concoursResults;
    } catch (err) {
        throw err;
    }
}

const changeExaminationSiteDetails = async (
    concoursId: string,
    newCitiesAssignments:any[]
) => {
    let finalChanges = []
    for(const newCityAssignment of newCitiesAssignments) {
        console.log(newCityAssignment);
        const { CandidatIds, newCityId } = newCityAssignment;
        const newExamCityAssignment = await prisma.ville_examen_candidat.updateMany({
            where: {
                candidatId: {
                    in: CandidatIds,
                },
            },
            // Other update data as needed
            data:{
                villeExamenId: newCityId,
            }
        });
        finalChanges.push(newExamCityAssignment);
    };
    return finalChanges;
};

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

const createOrGetConcoursResultRecord = async (concoursId: string) => {
    try {
        const concoursResult = await prisma.concoursResult.findUnique({
            where:{
                concoursId: concoursId,
            },
        })
        if(concoursResult) return concoursResult;
        const newConcoursResult = await prisma.concoursResult.create({
            data: {
                concours: {
                    connect: {
                        id: concoursId,
                    },
                },
            },
        });
        return newConcoursResult;
    } catch (err) {
        throw err;
    }
};

const setResults = async (
    concoursResultsId: string,
    summonedCandidatsAttachmentId: string|undefined,
    writtenExamAttachmentId:string|undefined,
    finalResultsAttachmentId:string|undefined,
    accessPlanAttachmentId:string|undefined
) => {
    try {
        const attachmentIds = [
            summonedCandidatsAttachmentId,
            writtenExamAttachmentId,
            finalResultsAttachmentId,
            accessPlanAttachmentId,
        ].filter(Boolean); // Remove undefined values

        const attachmentIdObjects = attachmentIds.map(id => ({ id })); // Convert to connectable objects array

        const concoursResult = await prisma.concoursResult.update({
            where:{
                id: concoursResultsId,
            },
            data: {
                attachments: {
                    connect: attachmentIdObjects,
                },
            },
        });

        return concoursResult;
    } catch (err) {
        throw err;
    }
}

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

const endConcours = async (id: string) => {
    try {
        const concours = await prisma.concours.update({
            where: {
                id: id,
            },
            data: {
                status: concoursStatus.ended,
            },
        });
        if(!concours)
            throw new httpException(404, "Aucun concours ne possède l'id: " + id);
        return concours;
    } catch (err) {
        throw err;
    }
}

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
    getExaminationSiteDetails,
    getResults,
    changeExaminationSiteDetails,
    create,
    createOrGetConcoursResultRecord,
    setResults,
    update,
    endConcours,
    remove,
};
