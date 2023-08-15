export type alert = {
    status: boolean;
    message: string;
    level?: "success" | "error" | "warning" | "info";
};

export interface alertState {
    alert: alert;
}
