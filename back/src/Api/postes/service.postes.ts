import {prisma} from '../../prisma/db.prisma'

const getAll = async () => {
    try {
        return await prisma.poste.findMany();
    } catch (err) {
        throw err;
    }
}

export default {
    getAll
};
