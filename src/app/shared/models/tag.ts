import { Note } from "./note";

export interface Tag {
    name   : string;
    notes? : Note[];
}
