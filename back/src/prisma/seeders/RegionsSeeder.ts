import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedRegions = async () => {
    const regions = [
        {
            id: '1',
            region: "l'Oriental",
        },
        {
            id: '2',
            region: 'Marrakech-Safi',
        },
        {
            id: '3',
            region: 'Drâa-Tafilalet',
        },
        {
            id: '4',
            region: 'Fès-Meknès',
        },
        {
            id: '5',
            region: 'Guelmim-oued Noun',
        },
        {
            id: '6',
            region: 'Tanger-Tétouan-Al Hoceima',
        },
        {
            id: '7',
            region: 'Souss-Massa',
        },
        {
            id: '8',
            region: 'Casablanca-Settat',
        },
        {
            id: '9',
            region: 'Dakhla-Oued Eddahab',
        },
        {
            id: '10',
            region: 'Beni Mellal-Khénifra',
        },
        {
            id: '11',
            region: 'Rabat-Salé-Kénitra',
        },
        {
            id: '12',
            region: 'Laâyoune-Sakia Al Hamra',
        }
    ];
    await prisma.region.deleteMany().catch(err => {
        throw err;
    });
    await prisma.region
        .createMany({
            data: regions.map(region => ({ id: parseInt(region.id), nom: region.region })),
        })
        .catch(err => {
            throw err;
        });
};

export default seedRegions;
