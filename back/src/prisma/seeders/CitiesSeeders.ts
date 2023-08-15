import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type city = {
    ville: string,
    region: string,
    chefRegion?: boolean
}

export const seedCities = async () => {
    const cities: city[] = [
        {
            ville: 'Oujda-Angad',
            region: '1',
            chefRegion: true
        },
        {
            ville: 'Nador',
            region: '1',
        },
        {
            ville: 'Driouch',
            region: '1',
        },
        {
            ville: 'Jerada',
            region: '1',
        },
        {
            ville: 'Berkan',
            region: '1',
        },
        {
            ville: 'Taourirt',
            region: '1',
        },
        {
            ville: 'Guercif',
            region: '1',
        },
        {
            ville: 'Figuig',
            region: '1',
        },
        {
            ville: 'Marrakech',
            region: '2',
            chefRegion: true
        },
        {
            ville: 'Chichaoua',
            region: '2',
        },
        {
            ville: 'Al Haouz',
            region: '2',
        },
        {
            ville: 'Kelâa des Sraghna',
            region: '2',
        },
        {
            ville: 'Essaouira',
            region: '2',
        },
        {
            ville: 'Rehamna',
            region: '2',
        },
        {
            ville: 'Safi',
            region: '2',
        },
        {
            ville: 'Youssoufia',
            region: '2',
        },
        {
            ville: 'Errachidia',
            region: '3',
            chefRegion: true
        },
        {
            ville: 'Ouarzazate',
            region: '3',
        },
        {
            ville: 'Midelt',
            region: '3',
        },
        {
            ville: 'Tinghir',
            region: '3',
        },
        {
            ville: 'Zagora',
            region: '3',
        },
        {
            ville: 'Fès',
            region: '4',
            chefRegion: true
        },
        {
            ville: 'Meknès',
            region: '4',
        },
        {
            ville: 'El Hajeb',
            region: '4',
        },
        {
            ville: 'Ifrane',
            region: '4',
        },
        {
            ville: 'Moulay Yacoub',
            region: '4',
        },
        {
            ville: 'Sefrou',
            region: '4',
        },
        {
            ville: 'Boulemane',
            region: '4',
        },
        {
            ville: 'Taounate',
            region: '4',
        },
        {
            ville: 'Taza',
            region: '4',
        },
        {
            ville: 'Guelmim',
            region: '5',
            chefRegion: true
        },
        {
            ville: 'Assa-Zag',
            region: '5',
        },
        {
            ville: 'Tan-Tan',
            region: '5',
        },
        {
            ville: 'Sidi Ifni',
            region: '5',
        },
        {
            ville: 'Tanger-Assilah',
            region: '6',
            chefRegion: true
        },
        {
            ville: "M'diq-Fnideq",
            region: '6',
        },
        {
            ville: 'Tétouan',
            region: '6',
        },
        {
            ville: 'Fahs-Anjra',
            region: '6',
        },
        {
            ville: 'Larache',
            region: '6',
        },
        {
            ville: 'Al Hoceima',
            region: '6',
        },
        {
            ville: 'Chefchaouen',
            region: '6',
        },
        {
            ville: 'Ouazzane',
            region: '6',
        },
        {
            ville: 'Agadir Ida-Ou-Tanane',
            region: '7',
            chefRegion: true
        },
        {
            ville: 'Inezgane-Aït Melloul',
            region: '7',
        },
        {
            ville: 'Chtouka-Aït Baha',
            region: '7',
        },
        {
            ville: 'Taroudannt',
            region: '7',
        },
        {
            ville: 'Tiznit',
            region: '7',
        },
        {
            ville: 'Tata',
            region: '7',
        },
        {
            ville: 'Casablanca',
            region: '8',
            chefRegion: true
        },
        {
            ville: 'Mohammadia',
            region: '8',
        },
        {
            ville: 'El Jadida',
            region: '8',
        },
        {
            ville: 'Nouaceur',
            region: '8',
        },
        {
            ville: 'Médiouna',
            region: '8',
        },
        {
            ville: 'Benslimane',
            region: '8',
        },
        {
            ville: 'Berrechid',
            region: '8',
        },
        {
            ville: 'Settat',
            region: '8',
        },
        {
            ville: 'Sidi Bennour',
            region: '8',
        },
        {
            ville: 'Oued Ed-Dahab',
            region: '9',
            chefRegion: true
        },
        {
            ville: 'Aousserd',
            region: '9',
        },
        {
            ville: 'Béni Mellal',
            region: '10',
            chefRegion: true
        },
        {
            ville: 'Azilal',
            region: '10',
        },
        {
            ville: 'Fquih Ben Salah',
            region: '10',
        },
        {
            ville: 'Khénifra',
            region: '10',
        },
        {
            ville: 'Khouribga',
            region: '10',
        },
        {
            ville: 'Rabat',
            region: '11',
            chefRegion: true
        },
        {
            ville: 'Salé',
            region: '11',
        },
        {
            ville: 'Skhirate-Témara',
            region: '11',
        },
        {
            ville: 'Kénitra',
            region: '11',
        },
        {
            ville: 'Khémisset',
            region: '11',
        },
        {
            ville: 'Sidi Kacem',
            region: '11',
        },
        {
            ville: 'Sidi Slimane',
            region: '11',
        },
        {
            ville: 'Laâyoune',
            region: '12',
            chefRegion: true
        },
        {
            ville: 'Boujdour',
            region: '12',
        },
        {
            ville: 'Tarfaya',
            region: '12',
        },
        {
            ville: 'Es-Semara',
            region: '12',
        }
    ];

    await prisma.ville.deleteMany().catch((err:any) => {
        throw err;
    });

    try {
        await Promise.all(
            cities.map(async city => {
                await prisma.ville.create({
                    data: {
                        nom: city.ville,
                        region: {
                            connect: {
                                id: parseInt(city.region),
                            },
                        },
                        chefRegion: city.chefRegion,
                    },
                });
            })
        );
    } catch (err) {
        throw err;
    }
};
