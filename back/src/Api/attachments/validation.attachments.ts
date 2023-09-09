import { z } from 'zod';
import { AttachmentTypes } from '@prisma/client';

const create = z.object({
    path: z.string().nonempty({ message: 'path is required' }),
    type: z.nativeEnum(AttachmentTypes),
    base64: z.string().nonempty({ message: 'base64 is required' }),
    candidatId: z.string().uuid().nullish(),
    concoursId: z.string().uuid().nullish(),
    diplomeId: z.string().uuid().nullish(),
})
.refine(
    data => {
        if (data.candidatId && data.diplomeId && !data.concoursId)
            return true;
        else if (!data.candidatId && !data.diplomeId && data.concoursId)
            return true;
        else return false;
    },
    {
        message:
            'The only possible combinations are: candidatId with diplomeId or concoursId alone!',
        path: ['candidatId', 'concoursId', 'diplomeId'], // specify the paths of the fields involved in the validation
    }
);

const getById = z.object({
    id: z.string().uuid().nonempty({ message: 'id is required' }),
});

const remove = z.object({
    id: z.string().uuid().nonempty({ message: 'id is required' }),
});

const deleteById = z.object({
    id: z.string().uuid().nonempty({ message: 'id is required' }),
});

export default {
    getById,
    create,
    remove,
    deleteById,
};
