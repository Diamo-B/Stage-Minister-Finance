import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedPostes = async () => {
    const postes = [
        "Ingenieur",
        "Technicien",
        'Administrateur',
        'Agent de Maitrise',
        'Ouvrier',
        'Chauffeur',
        'Agent de Service',
        'Agent de Surveillance',
        'Agent de Sécurité',
        'Agent de Bureau',
        'Agent de Saisie',
        'Agent de Maintenance',
        'Agent de Nettoyage',
        "RH",
        'Comptable',
        'Commercial',
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
