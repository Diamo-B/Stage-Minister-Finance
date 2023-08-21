import { useEffect, useState } from "react";
import { UilAngleRightB } from "@iconscout/react-unicons";
import { TCity } from "../../../../../redux/Admin/concours/types/create";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToHorizontalAxis, snapCenterToCursor } from "@dnd-kit/modifiers";
import DroppingContainer from "./droppinArea/droppingContainer";
import useCitiesHelpers from "../../../../../hooks/admin/concours/useCitiesDragNDropHelpers";
import DraggingContainer from "./draggingArea/draggingContainer";
import { useFormContext } from "react-hook-form";

const DragNDropCities = () => {
    const { setValue } = useFormContext();
    const {memoizedCityList} = useCitiesHelpers();

    const [cities, setCities] = useState<TCity[]>();

    useEffect(()=>{
        setCities(memoizedCityList);
    },[memoizedCityList]) 

    const [selectedCities, setSelectedCities] = useState<TCity[]>([]);

    //explain: This is updating the form data whenever the selected cities change
    useEffect(() => {
        setValue("villes", selectedCities.map(city => city.id));
    }, [selectedCities]);

    //? This function is used to add a city to the selectedCities array when it's dropped in the droppingArea
    function handleDragEnd(event: DragEndEvent) {
        const draggedCityId = event.active?.id; //explain: getting the id of the element being dragged

        //explain: checking if the element was dropped in the correct dropping zone (using it's id .e.g droppingArea)
        if (event.over?.id === "droppingArea") {

            //explain: check if the element isn't present in the selectedCities array then add it to it
            if (!selectedCities.some(city => city.id === draggedCityId)) {
                if (cities) {
                    setSelectedCities(prev => [
                        ...prev,
                        cities.filter(city => city.id === draggedCityId)[0],
                    ]);
                    //explain: remove the element from the original list
                    setCities(
                        prev =>
                            prev &&
                            prev.filter(city => city.id !== draggedCityId),
                    );
                }
            }
        }
    }

    //? This function is used to remove the city with the passed id from the selectedCities array and then add it to the cities array
    const removeCity = (id: string) => {
        if (selectedCities) {
            setCities(prev => [
                ...prev!,
                selectedCities.filter(city => city.id === id)[0],
            ]);
            setSelectedCities(prev => prev.filter(city => city.id !== id));
        }
    };


    return (
        <DndContext onDragEnd={handleDragEnd} modifiers={[snapCenterToCursor, restrictToHorizontalAxis]}>
            <div className="w-full flex flex-col gap-3 justify-center items-center mb-3">
                <div className="w-1/2 relative">
                    <div className="absolute -right-10 bottom-7 badge border-1 border-neutral-content font-bold">
                        Facultatif
                    </div>
                    <h2
                        id="cityChoiceTitle"
                        className="text-lg font-bold py-1 border-2 border-neutral-content rounded-full text-center"
                    >
                        Villes autorisées à passer le concours
                    </h2>
                </div>
            </div>
            <div className="w-full flex gap-5 bg-base-300 rounded-xl p-5">
                <div className="w-1/2 bg-white p-5 rounded-lg">
                    <h2 className="text-lg font-bold mb-3 py-1 border-2 border-neutral-content rounded-full text-center">
                        Villes disponibles
                    </h2>
                    <DraggingContainer cities={cities} />
                </div>
                <div className="divider divider-horizontal">
                    <UilAngleRightB className="w-24 h-24" />
                </div>
                <div className="w-1/2 bg-white p-5 rounded-lg">
                    <h2 className="text-lg font-bold mb-3 py-1 border-2 border-neutral-content rounded-full text-center">
                        Villes sélectionnés
                    </h2>
                    <DroppingContainer
                        id="droppingArea"
                        items={selectedCities}
                        removeItem={removeCity}
                    />
                </div>
            </div>
        </DndContext>
    );
};

export default DragNDropCities;
