import { UilSearch } from "@iconscout/react-unicons";
import { TCity } from "../../../../Redux/Admin/concours/types/create";
import { SetStateAction } from "react";

type Props = {
    data: TCity[];
    setter: SetStateAction<any>;
    placeholder: string;
}

const Search = ({data, setter, placeholder}: Props) => {

    const filterData = (e: any) => {
        const value = e.target.value.toLowerCase();
        const filter = data.filter((city) => {
            return city.nom.toLowerCase().includes(value);
        });
        setter(filter);   
    }

    return (
        <div className="w-full mx-3 relative">
            <input
                type="text"
                placeholder={placeholder}
                className="input input-sm input-bordered w-full text-center"
                onChange={filterData}
            />
            <UilSearch className="absolute w-5 h-5 top-1.5 left-3 " />
        </div>
    );
};

export default Search;
