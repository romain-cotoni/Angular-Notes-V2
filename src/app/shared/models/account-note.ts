import { Right } from "../enums/right";
import { AccountNoteId } from "./account-note-id";

export interface AccountNote {
    accountNoteId: AccountNoteId;
    accountId    : number;
    noteId       : number;
    right        : Right;
    message      : string;
    username?    : string;
}
