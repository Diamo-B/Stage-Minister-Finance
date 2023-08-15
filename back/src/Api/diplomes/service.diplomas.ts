import { prisma } from '../../prisma/db.prisma';

const getAll = async () => {
    try {
        return await prisma.diplome.findMany({
            orderBy: {
                type: {
                    nom: 'asc',
                },
            },
        });
    } catch (err) {
        throw err;
    }
};

const getAllByCandidatId = async (id: string) => {
    try {
        let diplomes = await prisma.diplome.findMany({
            where: {
                candidatId: id,
            },
            include:{
                type:{
                    select:{
                        nom:true
                    }
                },
                affiliation:{
                    select:{
                        Filiere:true
                    }
                },
                paysObtention:{
                    select:{
                        nom: true
                    }
                },
                ecole:{
                    select:{
                        nom:true
                    }
                },
                speciality:{
                    select:{
                        nom:true
                    }
                },
                attachments:{
                    select:{
                        path: true,
                    },
                    where:{
                        candidatId: id
                      
                    }
                }
            }
        })
        return diplomes;
    } catch (err) {
        throw err
    }
}

const getAllDiplomeTypes = async () => {
    try {
        return await prisma.diplomeType.findMany({
            select: {
                id: true,
                nom: true,
            },
            orderBy: {
                nom: 'asc',
            },
        });
    } catch (err) {
        throw err;
    }
};

const getAllDiplomeFilieres = async () => {
    try {
        return await prisma.affiliation.findMany({
            select: {
                id: true,
                Filiere: true,
            },
            orderBy: {
                Filiere: 'asc',
            },
        });
    } catch (err) {
        throw err;
    }
};

const getAllDiplomeSpecialities = async () => {
    try {
        return await prisma.diplomeSpecialite.findMany({
            select: {
                id: true,
                nom: true,
            },
            orderBy: {
                nom: 'asc',
            },
        });
    } catch (err) {
        throw err;
    }
};

const create = async (
    label: string,
    diplomeTypeId: string,
    affiliationId: string,
    year: string,
    countryId: string,
    schoolId: string,
    specialityId: string,
    candidatId: string,
    attachements: string[]
) => {
    try {
        return await prisma.diplome.create({
            data: {
                label,
                type: {
                    connect: {
                        id: diplomeTypeId,
                    },
                },
                affiliation: {
                    connect: {
                        id: affiliationId,
                    },
                },
                anneeObtention: year,
                paysObtention: {
                    connect: {
                        id: countryId,
                    },
                },
                ecole: {
                    connect: {
                        id: schoolId,
                    },
                },
                speciality: {
                    connect: {
                        id: specialityId,
                    },
                },
                candidat: {
                    connect: {
                        id: candidatId,
                    },
                },
                attachments:{
                    connect: attachements.map((attachement) =>{return{ id: attachement}}), 
                }
            },
            include: {
                type: {
                    select: {
                        nom: true,
                    },
                },
                affiliation: {
                    select: {
                        Filiere: true,
                    },
                },
                paysObtention: {
                    select: {
                        nom: true,
                    },
                },
                ecole: {
                    select: {
                        nom: true,
                    },
                },
                speciality: {
                    select: {
                        nom: true,
                    },
                },
                attachments: {
                    select:{
                        path:true
                    },
                    where:{
                        type:{
                            equals: 'DIPLOME'
                        }
                    }
                },
            },
        });
    } catch (err) {
        throw err;
    }
};

const deleteDiplome = async (id: string) => {
    try {
        return await prisma.diplome.delete({
            where: {
                id: id,
            },
        });
    } catch (err) {
        throw err;
    }
}

export default {
    getAll,
    getAllByCandidatId,
    getAllDiplomeTypes,
    getAllDiplomeFilieres,
    getAllDiplomeSpecialities,
    create,
    deleteDiplome,
};
