import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function generateJWT(payload:any, expiresIn:string) {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET as string, { expiresIn: expiresIn as string });
}