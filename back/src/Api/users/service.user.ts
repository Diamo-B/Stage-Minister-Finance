import { prisma } from '../../prisma/db.prisma';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const sendMailScript = require('../../utils/mailer/nodemailerOutlook.js'); // Provide the correct path if needed
import { hashPassword } from '../../utils/hashPassword';
import { AttachmentTypes } from '@prisma/client';


const getAll = async () => {
    try {
        return await prisma.user.findMany({
            select:{
                titre: true,
                id: true,
                cin: true,
                prenom: true,
                nom: true,
                email: true,
                password: false,
                adresse: true,
                dateNaissance: true,
                codePostal: true,
                telephone: true,
                villeId: false,
                ville: {
                    select: {
                        nom: true,
                    }
                }
            }
        });
    } catch (err) {
        throw err;
    }
};

const getOneId = async (id: string) => {
    try {
        return await prisma.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                cin: true,
                prenom: true,
                nom: true,
                email: true,
                password: false,
                adresse: true,
                dateNaissance: true,
                codePostal: true,
                telephone: true,
                villeId: false,
                ville: {
                    select: {
                        nom: true,
                    },
                },
            },
        });
    } catch (err) {
        throw err;
    }
};

const getByCandidatId = async (id: string) => {
    
    try {
        let user = await prisma.candidat.findFirst({
            where: {
                id: id,
            },
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        cin: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        adresse: true,
                        telephone: true,
                        dateNaissance: true,
                        codePostal: true,
                        villeId: false,
                        titre:true,
                        ville: {
                            select: {
                                id: true,
                                nom: true,
                            },
                        },
                    },
                },
            },
        });
        if(!user)
        {
            throw new Error("User not found");
        }
        else
            return user;
    } catch (err) {
        throw err;
    }

}

const getOneCIN =async (cin:string) => {
    try {
        return await prisma.user.findUnique({
            where: {
                cin: cin,
            },
            select: {
                id: true,
                cin: true,
                prenom: true,
                nom: true,
                email: true,
                password: false,
                adresse: true,
                dateNaissance: true,
                codePostal: true,
                telephone: true,
                villeId: false,
                ville: {
                    select: {
                        nom: true,
                    },
                },
            },
        });
    } catch (err) {
        throw err;
    }
}

const getOneEmail = async (email: string) => {
    try {
        return await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                cin: true,
                prenom: true,
                nom: true,
                email: true,
                password: false,
                adresse: true,
                dateNaissance: true,
                codePostal: true,
                telephone: true,
                villeId: false,
                ville: {
                    select: {
                        nom: true,
                    },
                },
            },
        });
    } catch (err) {
        throw err;
    }
};

const checkRegistration = async (email: string, cin: string) => {
    try {
        let user = await prisma.user.findFirst({
            where: {
                OR:[
                    {
                        email: email,
                    },
                    {
                        cin: cin,
                    }
                ]
            }
        });
        let returnObj = {
            cin: false,
            email: false
        };
        if(user?.cin === cin)
            returnObj.cin = true;
        if(user?.email === email)
            returnObj.email = true;
        return returnObj;
    } catch (err) {
        throw err;
    }
};

const sendMail = async (recipient: string) => {
    
    try {
        let sixDigitCode = Math.floor(100000 + Math.random() * 900000).toString();        
        const status = await sendMailScript(recipient, sixDigitCode);
        if(status.accepted.length > 0)
        {
            let hashReturn = await hashPassword(sixDigitCode.toString());
            return hashReturn.hashedpassword;
        }
        else
            throw status
    } catch (err:any) {
        throw new Error('Failed to send mail: ' + err.message);
    }
};

enum Titre {
    M='M',
    Mme='Mme',
    Mlle='Mlle',
}
const create = async (
    titre: Titre,
    prenom: string,
    nom: string,
    cin: string,
    email: string,
    password: string,
    naissance: Date,
    tel: string
) => {
    password = (await hashPassword(password)).hashedpassword;
    naissance = dayjs(naissance, 'DD-MM-YYYY').toDate();
    try {
        const user = await prisma.user.create({
            data: {
                titre,
                cin,
                prenom,
                nom,
                email,
                password,
                dateNaissance: naissance,
                telephone: tel,
            },
        });
        return user;
    } catch (err: any) {
        if (err.code == 'P2002') {
            if (err.meta?.target === 'User_cin_key') {
                throw { message: 'CIN already exists' };
            } else if (err.meta?.target === 'User_email_key') {
                throw { message: 'Email already exists' };
            }
        }
        throw err;
    }
};

const createCandidat = async (
    id: string,
    relatedPicIds: string[],
    concoursActifsIds: string[],
    diplomesIds: string[]
) => {
    try {
        let candidat = await prisma.candidat.create({
            data: {
                user: {
                    connect: {
                        id: id,
                    },
                },
                Attachments: {
                    connect:
                        relatedPicIds && relatedPicIds.length > 0
                            ? relatedPicIds.map(id => ({ id }))
                            : [],
                },
                concoursActifs: {
                    connect:
                        concoursActifsIds && concoursActifsIds.length > 0
                            ? concoursActifsIds.map(id => ({ id }))
                            : [],
                },
                diplomes: {
                    connect:
                        diplomesIds && diplomesIds.length > 0
                            ? diplomesIds.map(id => ({ id }))
                            : [],
                },
            },
            include:{
                user: true,
            }
        });
        return candidat;    
    } catch (err) {
        throw err;
    }
};

//explain: Linking attachments to candidats
//* step1: Linking CIN files to candidat (creating attachment record, saving the file in public folder, then linking it to candidat)
const linkAttachments = async (candidatId: string, AttachmentsIDS: string[]) => {
    try {
        let candidat = await prisma.candidat.update({
            where:{
                id: candidatId
            },
            data:{
                Attachments: {
                    connect:
                        AttachmentsIDS && AttachmentsIDS.length > 0
                            ? AttachmentsIDS.map(id => ({ id }))
                            : [],
                },
            },
            select:{
                userId: false,
                id: true,
                Attachments:{
                    where:{
                        type: {
                            in: ["CV","CIN"]
                        }
                    },
                    select:{
                        path: true,
                        type: true,
                        id: true,
                    }
                },
                diplomes: false,
                concoursActifs: false,
                user: false
            }
        })

        return candidat;
    } catch (err) {
        throw err;
    }
};

const createAdmin = async (id: string, isSuperAdmin: boolean) => {
    try {
        let admin = await prisma.admin.create({
            data: {
                user: {
                    connect: {
                        id: id,
                    },
                },
                isSuperAdmin: isSuperAdmin,
            },
        });
        return admin;
    } catch (err) {
        throw err;
    }
};

const update = async (
    id: string,
    adresse: string, 
    ville: string, 
    zip: number
) => {
    try {
        let user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                adresse: adresse,
                ville: {
                    connect:{
                        id: ville,
                    }
                },
                codePostal: zip,
            },
            include: {
                ville: true
            }
        });
        return user;
    } catch (err) {
        throw err;
    }
};

const remove = async (id: string) => {
    try {
        return await prisma.user.delete({
            where: {
                id: id,
            },
        });
    } catch (err:any) {
        if(err.code === "P2025")
        {
            throw {message: `No user with the id '${id}' was found`};
        }
        throw err;
    }
};


export default {
    getAll,
    getOneId,
    getOneCIN,
    getOneEmail,
    getByCandidatId,
    checkRegistration,
    sendMail,
    create,
    createCandidat,
    linkAttachments,
    createAdmin,
    update,
    remove,
};
