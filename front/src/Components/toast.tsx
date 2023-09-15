import { UilTimesCircle } from "@iconscout/react-unicons";
import { useAppDispatch, useAppSelector } from "../Hooks/redux";
import { useEffect } from "react";
import { disableAlert } from "../Redux/alerts";

const Toast = () => {
    const dispatch = useAppDispatch();
    const { alert } = useAppSelector(state => state.alert);
    useEffect(() => {

        setTimeout(() => {
            dispatch(disableAlert());
        },3000)

    }, []);

    const classNames=['alert', alert.level?alert.level:'' ,'flex' ,'justify-center' ,'hover:alert-error' ,'hover:cursor-pointer ','max-w-full','group','relative']
                
    return (
        <div className="toast w-3/12">
            <div
                className={classNames.join(' ')}
                onClick={() => dispatch(disableAlert())}
            >
                <span className="text-white font-bold text-center group-hover:hidden">
                    {alert.message}
                </span>
                <span className="text-white font-bold invisible group-hover:visible">
                    <UilTimesCircle className="w-8 h-8"/>
                </span>
            </div>
        </div>
    );
};

export default Toast;
