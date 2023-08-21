import { seedBranches } from './seeders/BrancheSeeders';
import { seedCities } from './seeders/CitiesSeeders';
import { seedDiplomes } from './seeders/DiplomesSeeders';
import seedGrades from './seeders/GradesSeeder';
import seedPays from './seeders/PaysSeeder';
import seedRegions from './seeders/RegionsSeeder';
import seedSpecialites from './seeders/SpecialiteSeeder';
import seedDirections from './seeders/directionsSeeder';
import { seedUniversities } from './seeders/ecolesSeeders';
import seedPostes from './seeders/postesSeeder';

const seed = async () => {
    await seedRegions()
        .then(async () => {
            console.log('Regions seeded successfully!');
            await seedCities()
                .then(() => {
                    console.log('Cities seeded successfully!');
                })
                .catch(error => {
                    console.log('error seeding the cities:', error);
                });
        })
        .catch(error => {
            console.log('error seeding the regions:', error);
        });

    await seedPays()
        .then(() => {
            console.log('Countries seeded successfully!');
        })
        .catch(error => {
            console.log('error seeding the countries:', error);
        });

    await seedUniversities()
        .then(() => {
            console.log('Universities seeded successfully!');
        })
        .catch(error => {
            console.log('error seeding the universities:', error);
        });

    await seedDiplomes()
        .then(() => {
            console.log(
                'Diplomas types, specialties and affiliations seeded successfully!'
            );
        })
        .catch(error => {
            console.log('error seeding the diplomas:', error);
        });

    await seedDirections()
        .then(() => {
            console.log('Directions seeded successfully!');
        })
        .catch(error => {
            console.log('error seeding the directions:', error);
        });

    await seedPostes()
        .then(() => {
            console.log('Postes seeded successfully!');
        })
        .catch(error => {
            console.log('error seeding the postes:', error);
        });

    await seedGrades()
        .then(() => {
            console.log('grades seeded successfully!');
        })
        .catch(error => {
            console.log('error seeding the grades:', error);
        });

    await seedBranches()
        .then(() => {
            console.log('branches seeded successfully!');
        })
        .catch(error => {
            console.log('error seeding the branches:', error);
        });

    await seedSpecialites()
        .then(() => {
            console.log('specialites seeded successfully!');
        })
        .catch(error => {
            console.log('error seeding the specialites:', error);
        });
};
seed();

export default seed;
