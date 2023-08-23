import { z } from "zod";
import { ILoginForm } from "../../utils/interfaces/Login/ILoginForm";
import { UseFormReset, UseFormSetFocus } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

const useFormRegistry = () => {
    const schema = z.object({
        email: z.string().email({message:'Adresse email invalide'}).nonempty(),
        password: z.string().min(8,{message:'Le mot de passe doit avoir un minimum de 8 caractères'}).nonempty(),
    });

    const checkLogin = (
        data: ILoginForm,
        setLoginError: Dispatch<SetStateAction<boolean>>,
        reset: UseFormReset<ILoginForm>,
        focus: UseFormSetFocus<ILoginForm>,
    ) => {
        console.log(data);
        setLoginError(true);
        focus("email",{shouldSelect: true})
        reset({password: ""});
    };

    return { schema, checkLogin };
}
 
export default useFormRegistry;