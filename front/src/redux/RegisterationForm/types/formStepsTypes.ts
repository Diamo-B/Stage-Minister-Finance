export interface Step {
    order: number;
    status: "pending" | "done" | "error";
}

export interface IformStepsState {
    current: number;
    steps: Step[];
    submitState: boolean;
    tourStatus: boolean;
}
