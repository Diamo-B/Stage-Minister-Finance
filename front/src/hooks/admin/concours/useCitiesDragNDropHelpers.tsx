import { useEffect, useMemo, useState } from "react";
import { TCity } from "../../../redux/Admin/concours/types/create";

const useCitiesHelpers = () => {
    const [cities, setCities] = useState<TCity[]>([]);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BackendBaseUrl}/api/v1/city/getAll`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async res => {
                const response = await res.json();                
                setCities(response);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const memoizedCityList = useMemo(() => {
        return cities;
    }, [cities]);

    return {memoizedCityList}
}
 
export default useCitiesHelpers;