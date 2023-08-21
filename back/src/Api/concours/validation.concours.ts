import { z } from "zod";

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

/* const BlobSchema = z.custom((value, ctx) => {
    if (value instanceof Blob) {
        // You can perform additional checks on the Blob properties here if needed
        return { success: true, data: value };
    } else {
        return { success: false, message: 'Invalid Blob object' };
    }
}); */

export default {
    create
}