import { prisma } from '../../prisma/db.prisma';

const getAll = async () => {
    try {
        return await prisma.pays.findMany({
            select: {
                id: true,
                nom: true,
                code: true,
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
