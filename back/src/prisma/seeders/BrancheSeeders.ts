import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const seedBranches = async () => {
    const branches = [
        "testBranche1",
    ];

    await prisma.branche.deleteMany().catch((err: any) => {
        throw err;
    });

   await prisma.branche
       .createMany({
           data: branches.map(branche => ({
               label: branche,
           })),
       })
       .catch(err => {
           throw err;
       });
};
