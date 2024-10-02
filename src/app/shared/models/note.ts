import { AccountNote } from "./account-note";
import { Tag } from "./tag";

export interface Note {
    id?           : number;
    title?        : string;
    creation?     : Date;
    isPublic?     : boolean;
    content?      : string;
    tags?         : Tag[];
    accountNotes? : AccountNote[];
}
