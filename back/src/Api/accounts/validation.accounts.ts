import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email().nonempty('Vous devez specifier un email'),
    password: z
        .string()
        .min(8, {
            message: 'Le mot de passe doit avoir un minimum de 8 caractères',
        })
        .nonempty('Vous devez specifier un mot de passe'),
});

const VerifyCandidatId = z.object({
    candidatId: z.string().uuid("l'id du candidat doit absolument être un UUID").nonempty('Vous devez specifier un candidatId'),
});

const forgetPasswordSchema = z.object({
    emailOrCin: z
        .string()
        .email({ message: 'Email ou CIN invalide' })
        .nonempty('Vous devez specifier un email ou un CIN')
        .or(
            z
                .string()
                .length(8,{ message: 'Email ou CIN invalide' })
                .nonempty('Vous devez specifier un email ou un CIN')
        ),
});

export default { loginSchema, forgetPasswordSchema, VerifyCandidatId };