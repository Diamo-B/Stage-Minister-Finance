import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./FormElements/input";
import { FormProvider, useForm } from "react-hook-form";
import useFormRegistry from "../hooks/login/useFormRegistry";
import { ILoginForm } from "../utils/interfaces/Login/ILoginForm";
import { useState } from "react";

const LoginForm = () => {
    const { schema, checkLogin } = useFormRegistry();

    const methods = useForm<ILoginForm>({
        resolver: zodResolver(schema),
    });

    const [loginError, setLoginError] = useState(false);

    const submit = (data: ILoginForm) => {
        checkLogin(data, setLoginError, methods.reset, methods.setFocus);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(submit)}>
                <div className="w-full mb-5">
                    {
                        loginError ?
                            <p className="text-center text-sm font-bold text-red-500">
                                Email ou mot de passe incorrect
                            </p>
                        : 
                            ""
                    }
                </div>
                <div className="form-control">
                    <Input
                        t_left_text="Email"
                        placeholder="exemple@exemple.com"
                        registerValue="email"
                        changeIndicatorPlacement
                        customIndicatorStyle="border-2 border-neutral-content"
                    />
                    <Input
                        t_left_text="Mot de passe"
                        placeholder="_ _ _ _ _ _ _ _"
                        type="password"
                        registerValue="password"
                        changeIndicatorPlacement
                        customIndicatorStyle="border-2 border-neutral-content"
                    />
                    <label className="label ml-auto">
                        <a
                            href="#"
                            className="label-text-alt text-sm link link-hover"
                        >
                            Mot de passe oublié?
                        </a>
                    </label>
                </div>
                <div className="flex justify-center mt-6 space-x-4">
                    <button className="btn btn-circle btn-info btn-wide text-info-content">
                        Se connecter
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};

export default LoginForm;
