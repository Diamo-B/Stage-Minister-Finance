import { Dispatch, SetStateAction, useEffect } from "react";
import { z } from "zod";
import { IConcours } from "../../../../Utils/interfaces/Admin/concours/IConcours";
import { UseFormGetValues } from "react-hook-form";
import { IFormType } from "../../../../Utils/interfaces/Admin/concours/IFormTypes";

type Props = {
    setSelectedDirection: Dispatch<SetStateAction<string>>;
    setSelectedPoste: Dispatch<React.SetStateAction<string>>;
    setSelectedGrade: Dispatch<React.SetStateAction<string>>;
    getValues: UseFormGetValues<IConcours>;
    directions: IFormType[];
    postes: IFormType[];
    grades: IFormType[];
};

const setIntitulePanelData = ({
    setSelectedDirection,
    setSelectedPoste,
    setSelectedGrade,
    getValues,
    directions,
    postes,
    grades,
}: Props) => {
    useEffect(() => {        
        const schema = z.string().uuid(); 
        if (directions.length>0 && postes.length>0 && grades.length>0) {
            if (
                schema.safeParse(getValues("direction")).success ===
                true
            ) {
                setSelectedDirection(
                    directions.filter(
                        d => d.id === getValues("direction"),
                    )[0].label as string,
                );
            }
            if (schema.safeParse(getValues("poste")).success === true) {
                setSelectedPoste(
                    postes.filter(p => p.id === getValues("poste"))[0]
                        .label as string,
                );
            }
            if (schema.safeParse(getValues("grade")).success === true) {
                setSelectedGrade(
                    grades.filter(g => g.id === getValues("grade"))[0]
                        .label as string,
                );
            }
        }
    }, [
        getValues("direction"),
        getValues("poste"),
        getValues("grade"),
        directions,
        postes,
        grades
    ]);
};

export default setIntitulePanelData;
