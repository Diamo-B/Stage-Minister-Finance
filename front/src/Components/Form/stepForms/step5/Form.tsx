import { useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IStep5Form } from "../../../../utils/interfaces/RegistrationForm/IStep5Form";
import useFormRegistry from "../../../../hooks/step5/useFormRegistry";
import CINCard from "./CINCard";
import CVCard from "./CVCard";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import {
    changeStepStatus,
    incrementStep,
    stopSubmit,
} from "../../../../redux/RegisterationForm/formSteps";
import Tabs from "../tabs";
import { setHint, setTab } from "../../../../redux/RegisterationForm/formTabs";
import Table from "../Table";
import useHelpers from "../../../../hooks/step5/useHelpers";
import AddedAttachment from "../../../../utils/tours/RegistrationForm/attachments/AddedAttachment";

const Form = () => {
    const dispatch = useAppDispatch();
    const { CVFiles, CINFiles, attachmentsRecords } = useAppSelector(
        state => state.lastStep,
    );
    const { loading } = useAppSelector(state => state.loading);
    const { current, submitState } = useAppSelector(state => state.formSteps);
    const { tab } = useAppSelector(state => state.formTabs);
    const { schema, handleAttachmentsLink } = useFormRegistry();
    const { FetchOnLoadData, deleteAttachmentRecord } = useHelpers();

    const methods = useForm<IStep5Form>({
        resolver: zodResolver(schema),
    });

    //explain: This handles the form submit (when the button `Valider les données` is clicked)
    const submit: SubmitHandler<IStep5Form> = data => {
        handleAttachmentsLink(data, emptyFields);
    };

    //explain: This initialises the component by applying the necessary changes on load
    useEffect(() => {
        localStorage.setItem("step", "5"); //?changes the step localStorage value to 5
        dispatch(changeStepStatus({ order: current, status: "pending" })); //?changes the step status to pending
        dispatch(setHint(0)); //?changes the hint value to 0
        dispatch(setTab(1)); //?changes the tab value to 1
        dispatch(stopSubmit()); //?changes the submit state to false
    }, []);

    //explain: This fetches the attachments from the database if the user had added them before and quitted the form, then sets the hint number
    useEffect(() => {
        FetchOnLoadData();
    }, []);

    //explain: This changes the step status to pending or error
    useEffect(() => {
        if (Object.values(methods.formState.errors).length > 0)
            dispatch(changeStepStatus({ order: current, status: "error" }));
        else dispatch(changeStepStatus({ order: current, status: "pending" }));
    }, [methods.formState.errors]);

    //explain: This handles the submit state (when the suivant button is clicked)
    useEffect(() => {
        if (submitState) {
            dispatch(changeStepStatus({
                order: current,
                status: "done",
            }))
            dispatch(incrementStep());
            dispatch(stopSubmit());
        }
    }, [submitState]);

    const [emptyFilesCIN, shouldEmptyFilesCIN] = useState<boolean>(false);
    const [emptyFilesCV, shouldEmptyFilesCV] = useState<boolean>(false);

    const emptyFields = (): void => {
        shouldEmptyFilesCIN(true);
        shouldEmptyFilesCV(true);
    };

    return (
        <div className="w-11/12 p-10 bg-base-200 rounded-2xl">
            <div className="flex justify-center mb-5">
                <Tabs
                    tab1Text="Ajouter les pièces jointes"
                    tab2Text="Consulter les pièces jointes"
                />
            </div>
            {tab === 1 && (
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(submit)}>
                        <div className="flex flex-col w-full border-opacity-50 items-center">
                            <div className="flex w-full lg:flex-row">
                                <CINCard
                                    emptyFilesCIN={emptyFilesCIN}
                                    shouldEmptyFilesCIN={shouldEmptyFilesCIN}
                                />
                                <div className="divider lg:divider-horizontal"></div>
                                <CVCard
                                    emptyFilesCV={emptyFilesCV}
                                    shouldEmptyFilesCV={shouldEmptyFilesCV}
                                />
                            </div>
                        </div>
                        <div className="mt-5 flex justify-center">
                            <button
                                className="btn btn-wide bg-base-300 hover:bg-white"
                                type="submit"
                                onClick={() => {
                                    methods.setValue("CV", CVFiles);
                                    methods.setValue("CIN", CINFiles);
                                }}
                            >
                                {!loading ? (
                                    "Valider les données"
                                ) : (
                                    <span className="loading loading-spinner"></span>
                                )}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            )}
            {tab === 2 && (
                <>
                    <Table
                        Records={attachmentsRecords}
                        deleteRecord={deleteAttachmentRecord}
                        tour={AddedAttachment}
                    />
                </>
            )}
        </div>
    );
};

export default Form;
