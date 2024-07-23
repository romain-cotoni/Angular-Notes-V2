import { Right } from "../enums/right";

export interface Note {
    id?: number;
    title?: string;
    content?: string;
    creation?: Date;
    right?: Right;
}
