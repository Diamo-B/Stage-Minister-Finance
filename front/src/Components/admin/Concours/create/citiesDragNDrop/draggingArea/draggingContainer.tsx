import { useEffect, useState } from "react";
import { TCity } from "../../../../../../redux/Admin/concours/types/create";
import Search from "../../Search";
import DraggableCityItem from "./DraggableCityItem";

type Props = {
    cities: TCity[] | undefined;
}

const DraggingContainer = ({cities}:Props) => {

    const [filteredCities, setFilteredCities] = useState<TCity[]>([]);

    useEffect(() => {
        //check if the items inside the filtredCities array are present in the items array, and remove them if they aren't
        if(cities)
        setFilteredCities(prev =>
            prev.filter(city => cities.some(newcity => newcity.id === city.id)),
        );
    }, [cities]);

    return (
        <>
            <div className="w-full flex justify-center items-center mb-5">
                <Search
                    data={cities || []}
                    setter={setFilteredCities}
                    placeholder="Rechercher une ville"
                />
            </div>
            <div className="mx-3 p-5 border-2 border-neutral-content rounded-xl grid grid-cols-3 gap-2 max-h-56 overflow-y-auto">
                {filteredCities.length === 0
                    ? cities?.map(city => (
                          <DraggableCityItem
                              id={city.id}
                              nom={city.nom}
                              key={city.id}
                              droppableId="droppable-area"
                          />
                      ))
                    : filteredCities?.map(city => (
                          <DraggableCityItem
                              id={city.id}
                              nom={city.nom}
                              key={city.id}
                              droppableId="droppable-area"
                          />
                      ))}
            </div>
        </>
    );
};

export default DraggingContainer;
