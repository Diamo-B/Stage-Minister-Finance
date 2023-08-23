import { useAppSelector, useAppDispatch } from "../../../redux";
import { mailSent } from "../../../../redux/user";
import bcrypt from "bcryptjs";

const useMailValidation = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    const sendMail = async () => {
        fetch(
            `${
                import.meta.env.VITE_BackendBaseUrl
            }/api/v1/user/register/verification/sendMail`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipient: {
                        titre: user.titre,
                        prenom: user.prenom,
                        nom: user.nom,
                        email: user.email,
                    },
                }),
            },
        )
            .then(async res => {
                const response = await res.json();
                localStorage.setItem("verificationToken", response.hash);
                dispatch(mailSent()); //? sets a state of mailSent to true to prevent sending additional mails
            })
            .catch(err => {
                console.error("mailSendingError:", err);
            });
    };

    const checkCode = async (code: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const verificationToken = localStorage.getItem("verificationToken");
            if (verificationToken) {
                bcrypt
                    .compare(code, verificationToken)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            } else {
                reject(new Error("Verification token not found"));
            }
        });
    };

    const saveUserInDB = async () => {
        fetch(
            `${
                import.meta.env.VITE_BackendBaseUrl
            }/api/v1/user/create/candidat`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    titre: user.titre,
                    prenom: user.prenom,
                    nom: user.nom,
                    cin: user.cin,
                    email: user.email,
                    password: user.password,
                    tel: user.tel,
                    naissance: user.naissance,
                }),
            },
        )
            .then(async res => {
                const response = await res.json();
                if (res.ok) {
                    localStorage.removeItem("verificationToken");
                    localStorage.setItem("token", response.token);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    return { sendMail, checkCode, saveUserInDB };
};

export default useMailValidation;
