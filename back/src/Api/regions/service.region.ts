
import { prisma } from '../../prisma/db.prisma';

const getAll = async () => {
    try {
        return await prisma.region.findMany({
            select: {
                id: true,
                nom: true,
                villes: {
                    select: {
                        id: true,
                        nom: true,
                        chefRegion: true
                    },
                }
            },
        });
    } catch (err) {
        throw err;
    }
};

const getAllWithoutCities = async () => {
    try {
        return await prisma.region.findMany({
            select: {
                id: true,
                nom: true,
            },
        });
    } catch (err) {
        throw err;
    }
};

export default {
    getAll,
    getAllWithoutCities,
};