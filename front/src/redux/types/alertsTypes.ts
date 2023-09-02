export type alert = {
    status: boolean;
    message: string;
    level?: "alert-success" | "alert-error" | "alert-warning" | "alert-info";
};

export interface alertState {
    alert: alert;
}
