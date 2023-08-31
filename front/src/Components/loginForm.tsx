import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./FormElements/input";
import { FormProvider, useForm } from "react-hook-form";
import useFormRegistry from "../Hooks/login/useFormRegistry";
import { ILoginForm } from "../Utils/interfaces/Login/ILoginForm";
import { Dispatch, SetStateAction, useState } from "react";
import { useAppSelector } from "../Hooks/redux";
import AnimatedButton from "./FormElements/animatedButton";
import { UilSignOutAlt } from "@iconscout/react-unicons";

type Props = {
    forgotPassword: boolean;
    setForgotPassword: Dispatch<SetStateAction<boolean>>;
}

const LoginForm = ({ forgotPassword, setForgotPassword }: Props) => {
    const { schema, checkLogin } = useFormRegistry();

    const methods = useForm<ILoginForm>({
        resolver: zodResolver(schema),
    });

    const [loginError, setLoginError] = useState<string>("");
    const { loading } = useAppSelector(state => state.loading);
    const submit = (data: ILoginForm) => {
        checkLogin(data, setLoginError, methods.reset, methods.setFocus);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(submit)}>
                <div className="w-full mb-5">
                    {loginError !== "" && (
                        <p className="text-center text-sm font-bold text-red-500">
                            {loginError}
                        </p>
                    )}
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
                            className="label-text-alt text-sm link link-hover"
                            type="button"
                            onClick={() => setForgotPassword(true)}
                        >
                            Mot de passe oublié?
                        </a>
                    </label>
                </div>
                <div className="flex justify-center mt-6 space-x-4">
                    <AnimatedButton
                        customButtonClasses={[
                            "!btn-wide",
                            "btn-info",
                            "border-2",
                            "hover:btn-info",
                            "text-neutral",
                            "rounded-full",
                        ]}
                        Icon={() => (
                            <UilSignOutAlt className="mx-auto w-7 h-7 text-white " />
                        )}
                        LoadingState={(loading && !forgotPassword)? true : false}
                        text={forgotPassword ? "Se connecter" : "Se connecter"}
                        btnType="submit"
                    />
                </div>
            </form>
        </FormProvider>
    );
};

export default LoginForm;
