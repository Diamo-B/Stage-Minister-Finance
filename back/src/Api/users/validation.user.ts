import { z } from 'zod';

const getOneId = z.object({
    id: z.string().uuid(),
});

const getOneCin = z.object({
    cin: z.string().nonempty(),
})

const getOneEmail = z.object({
    email: z.string().email().nonempty(),
})

const checkRegistration = z.object({
    email: z.string().email().nonempty(),
    cin: z.string().nonempty()
});

const sendMail = z.object({
    recipient: z.object({
        titre: z.enum(["M","Mme","Mlle"]),
        email: z.string().email().nonempty(),
        nom: z.string().nonempty(),
        prenom: z.string().nonempty(),
    }),
});

const create = z.object({
    titre: z.enum(["M","Mme","Mlle"]),
    cin: z.string().nonempty(),
    prenom: z.string().nonempty(),
    nom: z.string().nonempty(),
    email: z.string().email().nonempty(),
    password: z.string().min(6).nonempty(),
    adresse: z.string().nonempty().nullish(),
    naissance: z
        .string()
        .nonempty()
        .regex(/^\d{2}-\d{2}-\d{4}$/),
    villeid: z.string().uuid().nonempty().nullish(),
    codePostal: z.number().int().nonnegative().nullish(),
    tel: z.string().nonempty(),
});

const createCandidat = create.merge(
    z.object({
        relatedPicIds: z.array(z.string().uuid()).nullish(),
        concoursActifsIds: z.array(z.string().uuid()).nullish(),
        diplomesIds: z.array(z.string().uuid()).nullish(),
    })
);

const linkAttachments = z.object({
   
});

const createAdmin = create.merge(
    z.object({
        isSuperAdmin: z.boolean(),
    })
);

const update = z.object({
    adresse: z.string().nonempty(),
    ville: z.string().uuid().nonempty(),
    zip: z.number().int().positive().gt(10000).lte(99999)
});

const remove = z.object({
    id: z.string().uuid(),
});

const removeMany = z.object({});

export default {
    getOneId,
    getOneCin,
    getOneEmail,
    checkRegistration,
    sendMail,
    create,
    createCandidat,
    linkAttachments,
    createAdmin,
    update,
    remove,
    removeMany,
};
