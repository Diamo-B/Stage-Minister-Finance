import { prisma } from '../../prisma/db.prisma';

const getAll = async () => {
    try {
        return await prisma.ecole.findMany({
            select: {
                id: true,
                nom: true,
                ville: true,
            },
            orderBy:{
                nom: 'asc'
            }
        });
    } catch (err) {
        throw err;
    }
};

export default {
    getAll,
};
