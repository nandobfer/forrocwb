import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "./helpers";
import { Log, LogForm } from "./Log";
export type UserPrisma = Prisma.UserGetPayload<{}>;
export type UserForm = Omit<WithoutFunctions<User>, "id"> & {
    password: string;
};
export interface LoginForm {
    login: string;
    password: string;
}
export interface AccessToken {
    value: string;
    exp: number;
    iat: number;
}
export declare class User {
    id: string;
    name: string;
    email: string;
    phone: string;
    admin: boolean;
    static new(data: UserForm): Promise<User>;
    static login(data: LoginForm): Promise<User | null>;
    static getAll(): Promise<User[]>;
    static findById(id: string): Promise<User | null>;
    static findByEmail(email: string): Promise<User | null>;
    static delete(user_id: string): Promise<User>;
    constructor(data: UserPrisma);
    load(data: UserPrisma): void;
    update(data: Partial<UserForm>): Promise<void>;
    log(data: LogForm): Promise<Log>;
}
