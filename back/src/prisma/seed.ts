import {seedCities} from './seeders/CitiesSeeders'
import { seedDiplomes } from './seeders/DiplomesSeeders';
import seedPays from './seeders/PaysSeeder';
import seedRegions from './seeders/RegionsSeeder'
import { seedUniversities } from './seeders/ecolesSeeders';

const seed = async () => {
    await seedRegions()
    .then(async ()=>{
        console.log("Regions seeded successfully!");
        await seedCities()
        .then(() => {
            console.log("Cities seeded successfully!")
        })
        .catch((error) => {
            console.log("error seeding the cities:", error)
        })
    })
    .catch((error) => {
        console.log("error seeding the regions:", error)
    })

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
            console.log('Diplomas types, specialties and affiliations seeded successfully!');
        })
        .catch(error => {
            console.log('error seeding the diplomas:', error);
        });
}
seed();

export default seed;