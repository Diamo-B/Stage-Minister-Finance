import {useDraggable} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

type Props = {
    id: string;
    nom: string;
    droppableId: string;
};

const DraggableCityItem = ({ id, nom }: Props) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };


    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`p-1 border-2 flex justify-between ${
                isDragging ? "absolute z-50 bg-base-100" : ""
            }`}
        >
            {nom}
        </div>
    );
};
 
export default DraggableCityItem;