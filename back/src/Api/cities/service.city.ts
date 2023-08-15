import { prisma } from '../../prisma/db.prisma';


const getAll = async () => {
    try {
        return await prisma.ville.findMany({
            select:{
                id: true,
                nom: true,
                chefRegion: true,
                region: true
            }
        });
    } catch (err) {
        throw err;
    }
};

const getAllWithoutRegion = async () => {
    try {
        return await prisma.ville.findMany({
            select: {
                id: true,
                nom: true,
                chefRegion: true,
                regionId: true
            },
        });
    } catch (err) {
        throw err;
    }
};

export default {
    getAll,
    getAllWithoutRegion,
};