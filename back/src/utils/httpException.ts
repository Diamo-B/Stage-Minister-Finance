export default class httpException extends Error {
    public status: number;
    public message: string;

    constructor(status: number, msg: string) {
        super(msg);
        this.status = status;
        this.message = msg;
    }
}
