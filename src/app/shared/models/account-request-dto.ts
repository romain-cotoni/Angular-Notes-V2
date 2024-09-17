import { Role } from "../enums/role";

export interface AccountRequestDTO {
    firstname? : string;
    lastname?  : string;
    username   : string;
    email?     : string;
    password?  : string;
    role?      : Role;
}
