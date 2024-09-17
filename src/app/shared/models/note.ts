import { AccountNote } from "./account-note";

export interface Note {
    id?           : number;
    title?        : string;
    creation?     : Date;
    isPublic?     : boolean;
    content?      : string;
    accountNotes? : AccountNote[];
}
