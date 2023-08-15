import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const types = [
    'Baccalauréat',
    'Brevet',
    'Licence fondamentale',
    'Licence Professionnelle',
    'Master',
    'Doctorat',
    'Ingénieur',
    'Technicien',
];

const specialites = [
    'Web',
    'Mobile',
    'BI',
    'Big Data',
    'Cloud',
    'DevOps',
    'Sécurité',
    'AI',
];

const Affiliation = [
    {
        Filiere: 'Développement Informatique',
    },
    {
        Filiere: 'Réseaux et Télécommunications',
    },
    {
        Filiere: 'Systèmes et Logiciels Embarqués',
    },
    {
        Filiere: "Systèmes d'Information",
    },
    {
        Filiere: 'Génie Informatique',
    },
];

export const seedDiplomes = async () => {
    await prisma.diplomeType.deleteMany().catch(err => {
        throw err;
    });

    await prisma.affiliation.deleteMany().catch(err => {
        throw err;
    });

    await prisma.specialite.deleteMany().catch(err => {
        throw err;
    });

    await prisma.diplomeType
        .createMany({
            data: types.map(type => ({
                nom: type,
            })),
        })
        .catch(err => {
            throw err;
        });

    await prisma.diplomeSpecialite
        .createMany({
            data: specialites.map(specialite => ({
                nom: specialite,
            })),
        })
        .catch(err => {
            throw err;
        });

    await prisma.affiliation
        .createMany({
            data: Affiliation.map(aff => ({
                Filiere: aff.Filiere,
            })),
        })
        .catch(err => {
            throw err;
        });
};
