import { TitreEnum } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { hashPassword } from '../../utils/hashPassword';

export const seedAdminAccount = async () => {
    try {
        const password = await hashPassword('12345678');
        const data = {
            titre: TitreEnum.M,
            prenom: 'Admin',
            nom: 'Test',
            cin: 'EE123456',
            email: 'test@gmail.com',
            dateNaissance: new Date(),
            telephone: '0600000000',
            password: password.hashedpassword,
        }
    
        const user = await prisma.user.create({
            data: data,
        });
    
        const admin = await prisma.admin.create({
            data: {
                userId: user.id,
            },
        });    
    } catch (err) {
        throw err;
    }
};
