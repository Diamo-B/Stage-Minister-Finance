import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { $env } from '../../env';

dotenv.config();

export function generateJWT(payload:any, expiresIn:string) {
    return jsonwebtoken.sign(payload, $env.JWT_SECRET, { expiresIn: expiresIn as string });
}