import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedDirections = async () => {
    const directions = [
        "L' Inspection Générale des Finances",
        "L' Administration des Douanes et Impôts Indirects",
        'La Trésorerie Générale du Royaume',
        'La Direction Générale des Impôts',
        'La Direction du Budget',
        'La Direction du Trésor et des Finances Extérieures',
        'La Direction des Entreprises Publiques et de la Privatisation',
        "La Direction des Domaines de l'Etat",
        'La Direction des Affaires Administratives et Générales',
        'La Direction des Etudes et des Prévisions Financières',
        "L' Agence Judiciaire du Royaume",
        'La Direction de la Concurrence, des Prix et de la Compensation',
    ];
    await prisma.direction.deleteMany().catch(err => {
        throw err;
    });
    await prisma.direction
        .createMany({
            data: directions.map(direction => ({
                label: direction
            })),
        })
        .catch(err => {
            throw err;
        });
};

export default seedDirections;
