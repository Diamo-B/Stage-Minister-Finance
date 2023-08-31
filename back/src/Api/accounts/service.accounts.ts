import { hashPassword, validateHash } from '../../utils/hashPassword';
import { prisma } from '../../prisma/db.prisma';
import userService from '../users/service.user';
const sendMailScript = require('../../utils/mailer/nodemailerOutlook.js');
import { generateJWT } from '../../utils/JWT/generateJWT';
import httpException from '../../utils/httpException';

const verifyAccount = async (email: string, password: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                titre: true,
                nom: true,
                prenom: true,
                email: true,
                password: true,
                candidat: {
                    select: {
                        id: true,
                    },
                },
                admin: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (!user) return null;
        else {
            const valid = await validateHash(password, user.password);
            if (!valid) return null;
        }
        const { password: _, ...rest } = user; //? this is used to store everything except the password in the rest object
        return rest;
    } catch (err) {
        throw err;
    }
};

const registered = async (candidatId: string) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                candidat: {
                    id:candidatId
                },
            },
            select: {
                id: true,
                titre: true,
                nom: true,
                prenom: true,
                email: true,
                candidat: {
                    select: {
                        id: true,
                    },
                },
                admin: {
                    select: {
                        id: true,
                    },
                },
            }
        })
        if(!user) throw new httpException(404,'candidat introuvable');
        return user;
    } catch (err) {
        return err;
    } 
}

const sendForgotPasswordEmail = async (
    emailOrCin: string,
    isEmail: boolean
) => {
    let user;
    if (isEmail) {
        user = await userService.getOneEmail(emailOrCin);
        if (!user)
            throw new Error('Aucun utilisateur avec cet email');
    } else {
        user = await userService.getOneCIN(emailOrCin);
        if (!user)
            throw new Error('Aucun utilisateur avec cet CIN');
    }

    //explain: creating a jwt holding the userID
    const token = generateJWT({ id: user.id }, '1h');

    //explain: store it in the database user's record
    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            refreshPasswordToken: token,
        },
    }).catch((err) => {
        throw err;
    });

    const mailGenBody = {
        subject: 'Récupération du mot de passe',
        recipientMail: user.email,
        response: {
            body: {
                greeting: `${user.titre === 'M' ? 'Cher' : 'chère'} ${
                    user.titre
                }.`,
                name: `${user.prenom} ${user.nom}`,
                intro: "Bienvenue sur la plateforme e-Recrutement du Ministère de l'Économie et des Finances ! Nous vous souhaitons bonne chance pour vos prochains concours.",
                action: {
                    instructions:
                        'Veuillez cliquer sur le bouton ci-dessous pour créer un nouvel mot de passe :',
                    button: {
                        color: '#7986cb', //22BC66
                        text: `<span style="font-weight: bold">Nouvel mot de passe</span>`,
                        link: `${
                            process.env.FRONT_URL
                        }/reset-password/?token=${token}`,
                    },
                },
                outro: "Besoin d'aide ou avez-vous des questions ? Il vous suffit de répondre à cet e-mail, nous serions ravis de vous aider.",
                signature: 'Cordialement',
            },
        },
    };
    const status = await sendMailScript(mailGenBody);
    if (status.accepted.length > 0) {
        return user.email;
    } else throw new Error("Erreur lors de l'envoi du mail. réessayer plus tard");
};

const verifyResetPasswordToken = async (id: string, token: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            refreshPasswordToken: true,
        },
    });
    if (!user) throw new Error('Utilisateur introuvable');
    if (user.refreshPasswordToken !== token)
        throw new httpException(401, 'Token invalide');
    return true;
}

const resetPassword = async (id: string, newPassword: string) => {
    const { hashedpassword:hash } = await hashPassword(newPassword);
    let user = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            password: hash,
            refreshPasswordToken: null,
        },
        select:{
            id: true,
        }
    });
    return user.id;
}

export default {
    verifyAccount,
    sendForgotPasswordEmail,
    resetPassword,
    verifyResetPasswordToken,
    registered,
};
