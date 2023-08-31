import { Request, Response, NextFunction } from "express";
import httpException from "../../utils/httpException";
import accountsService from "./service.accounts";
import { generateJWT } from "../../utils/JWT/generateJWT";
import { CandidatAuthRequest } from "../../utils/interfaces/ModifiedRequestObject";

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await accountsService.verifyAccount(email, password);
        if(user === null || !user) 
        {
            next( new httpException(401, "Email ou mot de passe incorrect"));
        }
        else
        {
            //explain: Generates token
            const token = generateJWT({ user }, '2d');
            return res.status(200).json({ token, type: user.candidat? 'candidat' : 'admin' });
        }
    } catch (err: any) {
        next(new httpException(500, err.message));
    }
};

const registered = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { candidatId } = (req as CandidatAuthRequest).user;
        const user = await accountsService.registered(candidatId);
        if(user)
        {
            let AccessToken = generateJWT({ user }, '2d'); 
            return res.status(201).json({AccessToken});
        }
        
    } catch (err:any) {
        if(err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
};

const sendForgotPasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { emailOrCin } = req.body; 
        const isEmail = emailOrCin.includes('@');
        const email = await accountsService.sendForgotPasswordEmail(emailOrCin, isEmail);
        return res.status(200).json({ email });
    } catch (err:any) {
        next(new httpException(500, err.message));
    }
}

const verifyResetPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization')?.replace('Bearer ', '');
        const {id} = (req as CandidatAuthRequest).user;
        if(!token || !id)
        {
            next(new httpException(401, 'Token invalide'))
        }
        else
        {
            const valid = await accountsService.verifyResetPasswordToken(id, token);
            if(valid)
            {
                return res.status(200).json({ valid, id });
            }
        }
    } catch (err:any) {
        if(err instanceof httpException) next(err);
        next(new httpException(500, err.message));
    }
}


const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, newPassword } = req.body;
        const userId = await accountsService.resetPassword(id, newPassword);
        if (userId !== id) {
            throw new Error('Erreur inconnue');
        }
        return res.status(200).json({ userId });
    } catch (err:any) {
        next(new httpException(500, err.message));  
    }
}

export default {
    login,
    registered,
    sendForgotPasswordEmail,
    verifyResetPasswordToken,
    resetPassword,
};