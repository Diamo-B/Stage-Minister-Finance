import { Request } from 'express';

export interface CandidatAuthRequest extends Request {
    user: any;
}
