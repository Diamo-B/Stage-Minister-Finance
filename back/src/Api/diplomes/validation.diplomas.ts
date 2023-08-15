import { z } from 'zod';
import dayjs from 'dayjs';

// Custom transformation function to handle single strings
function singleStringToArray(value: string | string[]): string[] {
    if (typeof value === 'string') {
        return [value];
    }
    return value;
}

const create = z.object({
    intitule: z.string().nonempty({ message: "L'intitulé est obligatoire" }),

    etablissement: z
        .string()
        .uuid()
        .nonempty({ message: "Le pays d'obtention est obligatoire" }),

    type: z
        .string()
        .uuid()
        .nonempty({ message: "Le pays d'obtention est obligatoire" }),

    pays: z
        .string()
        .uuid()
        .nonempty({ message: "Le pays d'obtention est obligatoire" }),

    specialite: z
        .string()
        .uuid()
        .nonempty({ message: "Le pays d'obtention est obligatoire" }),

    filiere: z
        .string()
        .uuid()
        .nonempty({ message: "Le pays d'obtention est obligatoire" }),

    annee: z
        .string()
        .nonempty({ message: "L'année d'obtention est obligatoire" })
        .refine(
            value => {
                const currentYear = dayjs().year();
                const year = parseInt(value);
                return year > 1950 && year <= currentYear;
            },
            { message: "L'année d'obtention est invalide" }
        ),

    files: z
        .array(z.string())
        .nonempty({ message: 'Les fichiers sont obligatoires' })
        .refine(value => value.length < 3, {
            message: 'Vous pouvez fournir au plus deux fichiers',
        })
        .or(z.string()),

    name: z
        .array(z.string())
        .nonempty({ message: 'Les noms des fichiers sont obligatoires' })
        .refine(value => value.length < 3, {
            message: 'Vous pouvez fournir au plus deux noms de fichiers',
        })
        .or(z.string()),

    ext: z
        .array(z.string())
        .nonempty({ message: 'Les extensions des fichiers sont obligatoires' })
        .refine(value => value.length < 3, {
            message: 'Vous pouvez fournir au plus deux extensions de fichiers',
        })
        .or(z.string()),
});


const deleteDiplome = z.object({
    diplomeId: z.string().uuid().nonempty({ message: 'Le diplome est obligatoire' }),
    attachments: z.array(z.object({
        path: z.string().nonempty({ message: 'Le chemin du fichier est obligatoire' }),
    })).nonempty({ message: 'Les fichiers sont obligatoires' })
})

export default { create, deleteDiplome };