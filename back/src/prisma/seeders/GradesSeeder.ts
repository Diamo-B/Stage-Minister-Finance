import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const seedGrades = async () => {
    const grades = [
        'Grade 1',
        'Grade 2',
        'Grade Chef',
    ];
    await prisma.grade.deleteMany().catch(err => {
        throw err;
    });
    await prisma.grade
        .createMany({
            data: grades.map(grade => ({
                label: grade,
            })),
        })
        .catch(err => {
            throw err;
        });
};

export default seedGrades;
