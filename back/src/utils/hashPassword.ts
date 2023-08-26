import bcrypt from 'bcrypt';
import httpException from './httpException';

type hashReturn = {
    hashedpassword: string;
    salt: string;
}

export const hashPassword = async (password: string): Promise<hashReturn> => {
    try {
        const salt = await bcrypt.genSalt(10);
        let hashedpassword = await bcrypt.hash(password, salt);
        return {hashedpassword, salt};
    } catch (err: any) {
        throw new httpException(500, err.message);
    }
};

export const validateHash = async (password: string, hash: string): Promise<boolean> =>{
    try {
        const isValid = await bcrypt.compare(password, hash);
        return isValid;
    } catch (err:any) {
        throw err;
    }
}
