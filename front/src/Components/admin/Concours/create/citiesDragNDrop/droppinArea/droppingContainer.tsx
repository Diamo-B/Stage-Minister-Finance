import { useDroppable } from "@dnd-kit/core";
import { TCity } from "../../../../../../redux/Admin/concours/types/create";
import Search from "../../Search";
import { useEffect, useState } from "react";

type Props = {
    id: string;
    items: TCity[];
    removeItem: (id: string) => void;
};

const DroppingContainer = ({ id, items, removeItem }: Props) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    const [filteredCities, setFilteredCities] = useState<TCity[]>([]);

    useEffect(() => {
        //check if the items inside the filtredCities array are present in the items array, and remove them if they aren't
        setFilteredCities(prev =>
            prev.filter(city => items.some(item => item.id === city.id)),
        );
    }, [items]);

    return (
        <>
            <div className="w-full flex justify-center items-center mb-5">
                <Search
                    data={items}
                    setter={setFilteredCities}
                    placeholder="Rechercher une ville"
                />
            </div>
            <div
                className={` relative mx-3 p-5 border-2 border-neutral-content rounded-xl grid grid-cols-3 gap-2 h-56 max-h-56 overflow-y-auto`}
                ref={setNodeRef}
            >
                {isOver && (
                    <div className="w-full h-full absolute top-0 left-0 flex justify-center bg-slate-700/70 rounded-xl overflow-y-auto"></div>
                )}
                {filteredCities.length === 0
                    ? items.map(item => (
                          <div
                              key={item.id}
                              className="p-1 border-2 flex justify-between h-fit hover:bg-error hover:text-white hover:cursor-not-allowed"
                              onClick={() => {
                                  !isOver && removeItem(item.id);
                              }}
                          >
                              {item.nom}
                          </div>
                      ))
                    : filteredCities.map(item => (
                          <div
                              key={item.id}
                              className="p-1 border-2 flex justify-between h-fit hover:bg-error hover:text-white hover:cursor-not-allowed"
                              onClick={() => {
                                  !isOver && removeItem(item.id);
                              }}
                          >
                              {item.nom}
                          </div>
                      ))}
            </div>
        </>
    );
};

export default DroppingContainer;
