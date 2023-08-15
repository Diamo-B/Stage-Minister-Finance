import { setRegions, setCities } from "../../redux/RegisterationForm/Details";
import { useAppDispatch } from "../redux";

const useGetData = () => {
    const dispatch = useAppDispatch();

    const getRegions = async () => {
        fetch(
            `${
                import.meta.env.VITE_BackendBaseUrl
            }/api/v1/region/getAll/no-cities`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
            .then(async res => {
                const response = await res.json();
                dispatch(setRegions(response));
            })
            .catch(err => {
                console.error(err);
            });
    };

    const getCities = async () => {
        fetch(
            `${
                import.meta.env.VITE_BackendBaseUrl
            }/api/v1/city/getAll/no-regions`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
            .then(async res => {
                const response = await res.json();
                dispatch(setCities(response));
            })
            .catch(err => {
                console.error(err);
            });
    };

    return { getRegions, getCities };
};

export default useGetData;
