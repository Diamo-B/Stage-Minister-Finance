import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedPostes = async () => {
    const postes = [
        "Ingenieurs",
        "Techniciens",
        'Administrateurs',
        'Agents de Maitrise',
        'Ouvriers',
        'Chauffeurs',
        'Agents de Service',
        'Agents de Surveillance',
        'Agents de Sécurité',
        'Agents de Bureau',
        'Agents de Saisie',
        'Agents de Maintenance',
        'Agents de Nettoyage',
        "RH",
        'Comptables',
        'Commerciales',
    ];
    await prisma.poste.deleteMany().catch(err => {
        throw err;
    });
    await prisma.poste
        .createMany({
            data: postes.map(poste => ({
                label: poste
            })),
        })
        .catch(err => {
            throw err;
        });
};

export default seedPostes;
