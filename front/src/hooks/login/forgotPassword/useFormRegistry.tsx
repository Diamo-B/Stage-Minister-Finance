import { z } from "zod";
import { IForgotPassword } from "../../../utils/interfaces/Login/IForgotPassword";
import { useAppDispatch } from "../../redux";
import { setEmail } from "../../../redux/forgotPassword";
import { stopLoading } from "../../../redux/loading";

const useFormRegistry = () => {
    const schema = z.object({
        emailOrCin: z
            .string()
            .email({
                message: "l'identifiant spécifié n'est ni un email ni un cin",
            })
            .nonempty({ message: "Vous devez specifier un email ou un cin" })
            .or(
                z.string().length(8).nonempty({
                    message: "Vous devez specifier un email ou un cin",
                }),
            ),
    });

    const dispatch = useAppDispatch();
    const sendMail = async (
        data: IForgotPassword,
    ) => {
        fetch(
            `${import.meta.env.VITE_BackendBaseUrl}/accounts/forgotPassword`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    emailOrCin: data.emailOrCin,
                }),
            },
        )
            .then(async res => {
                const response = await res.json();
                dispatch(setEmail(response.email));
            })
            .catch(err => console.error(err))
            .finally(() => {
                dispatch(stopLoading());
            });
    };

    return { sendMail, schema };
};

export default useFormRegistry;
