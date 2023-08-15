import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { UilInfoCircle } from "@iconscout/react-unicons";
import { disableAlert } from "../../redux/alerts";
const Alert = () => {
    const dispatch = useAppDispatch();
    const { alert } = useAppSelector(state => state.alert);
    useEffect(() => {
        setTimeout(() => {
            dispatch(disableAlert());
        }, 1500);
    }, []);
    return (
        <>
            {alert.status === true && (
                <div
                    className={`alert ${
                        alert.level ? `alert-${alert.level}` : ""
                    } w-1/2 mb-10`}
                >
                    <UilInfoCircle />
                    <span>{alert.message}</span>
                </div>
            )}
        </>
    );
};

export default Alert;
