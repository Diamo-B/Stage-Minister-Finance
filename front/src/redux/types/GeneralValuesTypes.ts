import { z } from "zod";

export const connectedUserSchema = z.object({
    id: z.string().uuid().nonempty(),
    nom: z.string().nonempty(),
    prenom: z.string().nonempty(),
    email: z.string().email().nonempty(),
    titre: z.enum(['M', 'Mlle', 'Mme']),
    candidat: z.object({
        id: z.string().uuid().nonempty(),
        status: z.enum(['Verified', 'Active']),
    }).nullable(),
    admin: z.object({
        id: z.string().uuid().nonempty(),
    }).nullable(),
}) 

export interface GenValues {
    isDarkMode: boolean;
    connectedUser: z.infer<typeof connectedUserSchema> | null | "visitor";
} 