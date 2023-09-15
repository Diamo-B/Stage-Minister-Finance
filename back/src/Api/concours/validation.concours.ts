import { z } from "zod";

const getById = z.object({
    id: z.string().uuid({ message: 'L\'id du concours doit absolument être un UUID' }).nonempty({ message: 'L\'id du concours est obligatoire' })
})

const getExaminationSiteDetails = z.object({
    concoursId: z.string().uuid({ message: 'L\'id du concours doit absolument être un UUID' }).nonempty({ message: 'L\'id du concours est obligatoire' })
})

const ChangeExaminationSiteDetails = z.object({
    concoursId: z.string().uuid({ message: 'L\'id du concours doit absolument être un UUID' }).nonempty({ message: 'L\'id du concours est obligatoire' }),
    newCitiesAssignments: z.array(
        z.object({
            CandidatIds: z.array(
                z.string().uuid({ message: 'L\'id du candidat doit absolument être un UUID' }).nonempty({ message: 'L\'id du candidat est obligatoire' })
            ),
            newCityId: z.string().uuid({ message: 'L\'id de la ville doit absolument être un UUID' }).nonempty({ message: 'L\'id de la ville est obligatoire' })
        })
    ),
});

const create = z.object({
    label: z.string().nonempty({ message: 'Le label est obligatoire' }),
    directionId: z
        .string()
        .uuid()
        .nonempty({ message: 'Vous devez absolument specifier une direction' }),
    posteId: z
        .string()
        .uuid()
        .nonempty({ message: 'Vous devez absolument specifier un poste' }),
    gradeId: z
        .string()
        .uuid()
        .nonempty({ message: 'Vous devez absolument specifier un grade' }),
    brancheId: z
        .string()
        .uuid()
        .nonempty({ message: 'Vous devez absolument specifier une branche' }),
    specialiteId: z.string().uuid().nonempty({
        message: 'Vous devez absolument specifier une spécialité',
    }),
    maxPlaces: z
        .string()
        .refine(
            value => {
                const parsedValue = parseInt(value);
                return !isNaN(parsedValue);
            },
            { message: 'La valeur doit être un nombre valide' }
        )
        .transform(value => parseInt(value)) // Convert the string to number
        .refine(value => value > 0, {
            message: 'Le nombre des places doit être positif',
        })
        .refine(value => value >= 1, {
            message: 'Vous devez au moins ajouter une seule place',
        }),
    maxAge: z
        .string()
        .refine(
            value => {
                const parsedValue = parseInt(value);
                return !isNaN(parsedValue);
            },
            { message: 'La valeur doit être un nombre valide' }
        )
        .transform(value => parseInt(value)) // Convert the string to number
        .refine(value => value > 0, {
            message: 'Le nombre des places doit être positif',
        })
        .refine(value => value >= 17 && value <= 50, {
            message: "L'âge doit être entre 17 et 50 ans",
        }),
    dateLimiteDepot: z
        .string()
        .nonempty({ message: 'La date limite de depot est obligatoire' }),
    dateConcours: z
        .string()
        .nonempty({ message: 'La date du concours est obligatoire' }),
    villesIds: z.string()
});

const update = z.object({
    id: z.string().uuid({ message: 'L\'id du concours doit absolument être un UUID' }).nonempty({ message: 'L\'id du concours est obligatoire' }),
}).merge(create)

const updateStatus = z.object({
    id: z
        .string()
        .uuid({ message: "L'id du concours doit absolument être un UUID" })
        .nonempty({ message: "L'id du concours est obligatoire" }),
});

const remove = z.object({
    id: z.string().uuid({ message: 'L\'id du concours doit absolument être un UUID' }).nonempty({ message: 'L\'id du concours est obligatoire' })
})

export default {
    getById,
    getExaminationSiteDetails,
    ChangeExaminationSiteDetails,
    create,
    update,
    updateStatus,
    remove
}