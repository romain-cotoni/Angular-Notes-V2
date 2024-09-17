export interface Account {
    id?        : number;
    firstname? : string;
    lastname?  : string;
    username?  : string;
    email?     : string;
    role       : string;
    isDevMode  : boolean;
    isToolTips : boolean;
    isEditable : boolean;
}
