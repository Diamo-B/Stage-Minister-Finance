import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedSpecialites = async () => {
    const specialites = [
        'testSpecialite1',
        'testSpecialite2',
        'testSpecialite3',
        'testSpecialite4',
    ];
    await prisma.specialite.deleteMany().catch(err => {
        throw err;
    });
    await prisma.specialite
        .createMany({
            data: specialites.map(specialite => ({
                label: specialite,
            })),
        })
        .catch(err => {
            throw err;
        });
};

export default seedSpecialites;
